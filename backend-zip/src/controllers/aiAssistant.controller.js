// ai.controller.js
require('dotenv').config();

const orderService = require("../services/order.service");
const productService = require("../services/product.service");
const userService = require("../services/user.service");

// If you're on Node 18+ you can use global fetch. If not, ensure node-fetch@2 is installed.
const fetch = require("node-fetch");
const stringSimilarity = require("string-similarity");
const leoProfanity = require("leo-profanity");
const { HfInference } = require("@huggingface/inference");
const Redis = require("redis");

// Load profanity dictionary once (optional)
try {
  leoProfanity.loadDictionary(); // loads English default words
} catch (e) {
  // ignore if already loaded or not available
}

// Helper: check profanity using leo-profanity
const isProfane = (text = "") => {
  try {
    return leoProfanity.check(String(text));
  } catch (e) {
    console.error("leo-profanity check failed", e);
    return false;
  }
};

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
const HF_MODEL = process.env.HF_DEFAULT_MODEL || "google/flan-t5-xl";
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const SESSION_TTL = Number(process.env.SESSION_TTL || 600);

// --------------------- Redis with fallback ---------------------
let redisClient = null;
let redisAvailable = false;

// In-memory fallback if Redis is not running
const memoryStore = new Map();

async function initRedis() {
  try {
    redisClient = Redis.createClient({
      url: REDIS_URL,
      socket: { reconnectStrategy: false } // don't retry
    });

    redisClient.on("error", (err) => {
      console.warn("❌ Redis error:", err?.message || err);
      redisAvailable = false;
    });

    redisClient.on("ready", () => {
      console.log("✅ Redis connected");
      redisAvailable = true;
    });

    await redisClient.connect();
  } catch (err) {
    console.warn("⚠️ Redis not running — using in-memory session store.");
    redisAvailable = false;
    redisClient = null;
  }
}

// Initialize Redis (but don't crash if unavailable)
initRedis();

// Session helpers
const getSession = async (userId) => {
  const key = `session:${userId}`;

  // Use Redis if available
  if (redisAvailable && redisClient) {
    try {
      const raw = await redisClient.get(key);
      return raw ? JSON.parse(raw) : { history: [] };
    } catch (err) {
      console.warn("Redis get failed → fallback", err?.message || err);
    }
  }

  // Fallback store
  return memoryStore.get(key) || { history: [] };
};

const saveSession = async (userId, session) => {
  const key = `session:${userId}`;

  // Use Redis if available
  if (redisAvailable && redisClient) {
    try {
      await redisClient.setEx(key, SESSION_TTL, JSON.stringify(session));
      return;
    } catch (err) {
      console.warn("Redis set failed → fallback", err?.message || err);
    }
  }

  // Fallback store
  memoryStore.set(key, session);
};

async function resolveProductFromQuery(session, rawQuery) {
  const qRaw = String(rawQuery || "").trim();
  const qNorm = qRaw.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ").trim();

  // 0) If query is empty, try session.lastProductId or lastProducts
  if (!qRaw) {
    if (session?.lastProductId) {
      try { return await productService.findProductById(session.lastProductId); } catch (e) { /* ignore */ }
    }
    const last = session?.lastProducts?.[0];
    if (last) {
      try { return await productService.findProductById(last._id); } catch (e) { /* ignore */ }
    }
    return null;
  }

  // 1) if looks like ObjectId, try by id
  if (/^[0-9a-fA-F]{24}$/.test(qRaw)) {
    const byId = await productService.findProductById(qRaw).catch(() => null);
    if (byId) return byId;
  }

  // 2) try findBestProduct (improved)
  const dbMatch = await productService.findBestProduct(qRaw);
  if (dbMatch) return dbMatch;

  // 3) try fuzzy match against session.lastProducts titles (if any)
  try {
    const lastProducts = (session && session.lastProducts) || [];
    if (lastProducts.length) {
      const titles = lastProducts.map(p => (p.title || "").toLowerCase());
      // exact normalized match first
      const idxExact = titles.findIndex(t => t.replace(/[^\w\s]/g, "").replace(/\s+/g, " ").trim() === qNorm);
      if (idxExact !== -1) {
        return await productService.findProductById(lastProducts[idxExact]._id);
      }
      // fuzzy using stringSimilarity
      const match = stringSimilarity.findBestMatch(qRaw.toLowerCase(), titles);
      if (match && match.bestMatch && match.bestMatch.rating > 0.4) {
        return await productService.findProductById(lastProducts[match.bestMatchIndex]._id);
      }
    }
  } catch (e) {
    console.warn("session fuzzy resolve failed", e?.message || e);
  }

  // 4) nothing matched
  return null;
}

// ---------------------------- Utilities ----------------------------
const normalize = (s = "") => (s || "").trim();

const safeSendToLLM = async (prompt, opts = {}) => {
  try {
    const params = {
      max_new_tokens: opts.max_new_tokens ?? 256,
      temperature: opts.temperature ?? 0.2,
      top_k: opts.top_k,
      top_p: opts.top_p,
    };
    const resp = await hf.textGeneration({ model: HF_MODEL, inputs: prompt, parameters: params });
    if (!resp) return null;
    if (resp.generated_text) return resp.generated_text;
    if (Array.isArray(resp) && resp[0]?.generated_text) return resp[0].generated_text;
    return JSON.stringify(resp).slice(0, 2000);
  } catch (err) {
    console.error("HF generation error:", err?.message || err);
    return null;
  }
};

const redactPII = (text = "") => {
  if (!text) return text;
  return String(text)
    .replace(/\b\d{12,19}\b/g, "[REDACTED_CARD]")
    .replace(/\b\d{10}\b/g, "[REDACTED_PHONE]")
    .replace(/\S+@\S+\.\S+/g, "[REDACTED_EMAIL]");
};

const fuzzyMatch = (input, candidates = []) => {
  if (!input) return null;
  const scores = stringSimilarity.findBestMatch(input.toLowerCase(), candidates.map(c => c.toLowerCase()));
  if (!scores || !scores.bestMatch) return { best: null, rating: 0 };
  return { best: candidates[scores.bestMatchIndex], rating: scores.bestMatch.rating };
};



// ---------------------------- Advanced intents ----------------------------
const intents = [
  {
    name: "greeting",
    priority: 10,
    pattern: /\b(hi|hello|hey|good morning|gm|good afternoon|good evening|namaste|salaam)\b/i,
    handler: async (req, match, ctx) => {
      const hour = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", hour12: false });
      return `Hi ${req.user?.name || ""}! 👋 Good to see you. Current IST hour: ${hour}. How can I assist you today?`;
    },
  },

  {
    name: "how_are_you",
    priority: 12,
    pattern: /\bhow\s+are\s+you\b|\bhow's\s+it\s+going\b/i,
    handler: async () => "I'm doing great! 😄 Thanks for asking — what can I help with today?",
  },

  {
    name: "today_date",
    priority: 14,
    pattern: /\b(today(?:'s)?\s*(date|time)?|what(?:'s| is)?\s*(the\s*)?(date|time)|current\s*(date|time)|what\s*day\s*(is\s*it)?)\b/i,
    handler: async () => {
      const now = new Date();
      const dateStr = new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(now);
      const timeStr = new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(now);
      return `Today is ${dateStr} (Asia/Kolkata). Current time: ${timeStr} (IST).`;
    },
  },

  {
    name: "latest_order",
    priority: 20,
    pattern: /\b(latest|last)\s+order\b/i,
    handler: async (req) => {
      const user = req.user;
      const orders = await orderService.usersOrderHistory(user._id);
      if (!orders || orders.length === 0) return "You haven't placed any orders yet.";
      const latest = orders[0];
      const itemName = latest?.orderItems?.[0]?.name || "item";
      return `🧾 Your latest order is ${itemName} — placed on ${new Date(latest.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}. Total: ₹${latest.totalPrice}. Status: ${latest.orderStatus}.`;
    },
  },

  {
    name: "price_of",
    priority: 25,
    pattern: /\bprice\s+of\s+(.+)/i,
    handler: async (req, match) => {
      const query = normalize(match[1] || "");
      if (!query) return "Which product would you like the price for?";
      let products = await productService.searchProducts(query);
      if (products && products.length) {
        return `🛍️ The price of "${products[0].name}" is ₹${products[0].price}.`;
      }

      try {
        const names = await productService.listAllNames?.();
        if (names && names.length) {
          const fm = fuzzyMatch(query, names);
          if (fm && fm.rating > 0.6) {
            const found = await productService.findByName(fm.best);
            if (found) return `🛍️ I found "${found.name}" (did you mean this?). Price: ₹${found.price}.`;
          }
        }
      } catch (e) { /* ignore */ }

      try {
        const prompt = `Find a short description for product matching: "${query}"`;
        const hfReply = await safeSendToLLM(`User: ${prompt}\nAssistant:`);
        if (hfReply) return `I couldn't find an exact product, but here's a suggestion: ${hfReply}\nTry 'price of <exact product name>' if you see a match.`;
      } catch (e) { console.error(e); }

      return `No product found matching "${query}". Try rephrasing or check product name casing.`;
    },
  },

  {
    name: "order_status_by_id",
    priority: 30,
    pattern: /\b(order status|track order).*(#?\s?([A-Za-z0-9\-]+))?/i,
    handler: async (req, match) => {
      const maybeId = match[3];
      const user = req.user;
      if (maybeId) {
        const order = await orderService.getOrderById(maybeId);
        if (!order) return `Couldn't find an order with id ${maybeId}.`;
        if (String(order.user) !== String(user._id)) return "You can only view your own orders.";
        return `Order ${order._id}: Status ${order.orderStatus}, Total ₹${order.totalPrice}.`;
      }
      const orders = await orderService.usersOrderHistory(user._id);
      if (!orders || orders.length === 0) return "You haven't placed any orders yet.";
      const latest = orders[0];
      return `Latest order ${latest._id}: Status ${latest.orderStatus}, placed on ${new Date(latest.createdAt).toLocaleString("en-IN", { timeZone: 'Asia/Kolkata'})}.`;
    },
  },

  {
    name: "thanks",
    priority: 40,
    pattern: /\b(thank(s| you)?|tanku|tank you)\b/i,
    handler: async () => "You're welcome! 😊 If you need anything else, ask away.",
  },

  {
    name: "help",
    priority: 90,
    pattern: /\b(help|commands|examples|what can you do)\b/i,
    handler: async () => {
      return `I can: check your latest order, give product prices (try "price of cotton kurti"), show Super Coins, and tell the date/time. Try: "show my latest order", "price of black blazer", "how many super coins do I have?"`;
    },
  },
  {
  name: "super_coins",
  priority: 15,
  pattern: /\b(super\s*coins?|supercoin|how\s+many\s+super\s*coins?|super\s*coin\s*(do\s*i\s*have|left|balance)?)\b/i,

  handler: async (req) => {
    const user = req.user;
    return `💰 You have ${user.superCoins || 0} Super Coins available.`;
  },
},
{
  name: "contact_number",
  priority: 18,
  pattern: /\b(customer\s*(care|support)\s*(number|contact)|contact\s*(number|us)|support\s*(number|line|team)|help\s*number|phone\s*number|call\s*you|how\s*to\s*contact|customer\s*service)\b/i,
  handler: async () => {
    return "📞 You can reach our customer support at: **+91 98765 43210**.\nWe’re available 10 AM – 7 PM (Mon–Sat).";
  }
},
{
  name: "check_size_availability",
  priority: 23,
  pattern: /\b(is it available in|do you have|available in|have it in)\s*(size\s*)?([xsmlXL0-9]+)\b/i,
  handler: async (req, match, ctx) => {
    const sizeAskedRaw = (match[3] || "").trim();
    if (!sizeAskedRaw) return "Which size do you want to check? (e.g., S, M, L)";

    const sizeAsked = sizeAskedRaw.toLowerCase();
    const session = ctx.session || (await getSession(req.user._id));
    const productId = session.lastProductId;
    if (!productId) {
      return "Which product are you asking about? Please say 'tell me about <product>' first.";
    }

    try {
      const product = await productService.findProductById(productId);
      if (!product) return "I can't find the product information right now.";

      const sizeObj = (product.sizes || []).find(s => String(s.name || s).toLowerCase() === sizeAsked);
      if (!sizeObj) return `No — ${product.title} is not available in ${sizeAskedRaw.toUpperCase()}.`;
      const qty = sizeObj.quantity ?? 0;
      return qty > 0 ? `Yes — ${product.title} is available in ${sizeAskedRaw.toUpperCase()} (${qty} available).` :
                        `No — ${product.title} is currently out of stock in ${sizeAskedRaw.toUpperCase()}.`;
    } catch (err) {
      console.error("check_size_availability error", err);
      return "Sorry, can't check size availability right now. Try later.";
    }
  }
},
{
  name: "category_info",
  priority: 19,
  pattern: /\b(tell me about|show me|do you have|list|what about|give me|i want)\s+([a-zA-Z ]+?)s?\b/i,
  handler: async (req, match) => {
    const categoryQuery = (match[2] || "").trim();
    if (!categoryQuery) {
      return "Which category should I show? (e.g. tops, kurtis, shirts)";
    }

    const products = await productService.getProductsByCategoryName(categoryQuery, 8);

    if (!products || products.length === 0) {
      return `I couldn't find any items in the "${categoryQuery}" category.`;
    }

    // Save summary (id + title) to session for follow-ups
    try {
      const session = await getSession(req.user._id);
      session.lastProducts = products.map(p => ({ _id: String(p._id), title: p.title || "" }));
      session.lastProductId = String(products[0]._id);
      session.history = session.history || [];
      session.history.push({ user: req.body.message || "", bot: `Listed ${products.length} items in ${categoryQuery}`, intent: "category_info", ts: Date.now() });
      await saveSession(req.user._id, session);
    } catch (e) {
      console.warn("Failed to save session lastProducts", e?.message || e);
    }

    const list = products
      .slice(0, 6)
      .map(p => `• ${p.title} — ₹${p.discountedPrice || p.price}`)
      .join("\n");

    return `Here are some ${categoryQuery}:\n${list}\n\nYou can say: "tell me about <product name>" or "describe <product name>" for full details.`;
  }
},

{
  name: "product_info",
  priority: 22,
  // matches: "tell me about X", "describe X", "details of X", or strings that are just a product name
  pattern: /\b(?:tell me about|tell me|describe|details of|what about|info on|information on|give details on|show me)\s+(.+)|^([A-Za-z0-9\s\-\&']{2,})$/i,
  handler: async (req, match, ctx) => {
    // prefer the captured product text: group 1 from the verb-prefixed pattern, or group 2 for bare messages
    const rawA = (match[1] || "").trim();
    const rawB = (match[2] || "").trim();
    // choose the one that looks meaningful (if both present prefer rawA)
    const productQuery = rawA || rawB || "";

    // load session (so resolver can use it)
    const session = ctx.session || (await getSession(req.user._id));

    // Resolve a product using session context + DB
    let resolvedProduct = null;
    try {
      resolvedProduct = await resolveProductFromQuery(session, productQuery);
    } catch (e) {
      console.error("resolveProductFromQuery error", e);
    }

    if (!resolvedProduct) {
      // if we couldn't resolve, as a helpful fallback show similar items
      const results = await productService.searchProducts(productQuery || (session && session.lastProducts && session.lastProducts.length ? session.lastProducts.map(p=>p.title).join(" ") : ""), { limit: 5 });
      if (!results || results.length === 0) {
        return productQuery
          ? `I couldn't find "${productQuery}". Try the exact product name or ask 'show me <category>'.`
          : `I couldn't tell which product you mean. Try "tell me about <product name>" or ask "show me <category>".`;
      }
      // show similar items
      const titles = results.map(p => `${p.title}${p.brand ? " by " + p.brand : ""} (id:${p._id})`).slice(0, 5).join("\n");
      return `I couldn't find an exact match. Here are similar items:\n${titles}\nYou can ask 'tell me about <exact title>' to get details.`;
    }

    // Got product — fetch formatted info
    try {
      const infoObj = await productService.getProductInfo(resolvedProduct);
      if (!infoObj) return "Couldn't build product info right now. Try again.";

      // Save lastProductId in session (for future follow-ups)
      try {
        session.lastProductId = String(infoObj.productId || resolvedProduct._id);
        // optional: also ensure lastProducts contains this product at top
        session.lastProducts = session.lastProducts || [];
        const exists = session.lastProducts.find(p => p._id === String(infoObj.productId));
        if (!exists) session.lastProducts.unshift({ _id: String(infoObj.productId), title: resolvedProduct.title || "" });
        await saveSession(req.user._id, session);
      } catch (e) { /* ignore session save error */ }

      return infoObj.text || infoObj;
    } catch (err) {
      console.error("product_info handler error", err);
      return "Sorry, I had trouble fetching product details. Try again in a moment.";
    }
  },
},


];

// ---------------------------- Core assistant ----------------------------
const aiChatAssistant = async (req, res) => {
  try {
    const rawMessage = normalize(req.body.message || "");
    const user = req.user || { _id: "anon", name: "Guest", superCoins: 0 };

    if (!rawMessage) return res.json({ reply: "Please send a message for me to help with." });

    // profanity / PII filter before processing
    if (isProfane(rawMessage)) {
      return res.json({ reply: "I can't respond to that. Please keep language clean." });
    }
    const cleanedMessage = redactPII(rawMessage);

    // session load (for multi-turn)
    const session = await getSession(user._id);
    session.history = (session.history || []).slice(-10);

    // intent matching (by priority + regex)
    const ordered = intents.slice().sort((a, b) => (a.priority || 100) - (b.priority || 100));
    for (const intent of ordered) {
      const match = cleanedMessage.match(intent.pattern);
      if (match) {
        try {
          const reply = await intent.handler(req, match, { session });
          session.history.push({ user: cleanedMessage, bot: reply, intent: intent.name, ts: Date.now() });
          await saveSession(user._id, session);
          return res.json({ reply });
        } catch (err) {
          console.error("Intent handler error", intent.name, err);
          return res.json({ reply: "Sorry, something went wrong handling that request." });
        }
      }
    }

    // HF fallback
    try {
      const lastContext = session.history.slice(-4).map(h => `User: ${h.user}\nAssistant: ${h.bot}`).join("\n");
      const system = `You are a helpful, concise, and polite e-commerce assistant for the store Fluteon. Keep replies short (<= 120 words). When asked about orders, always remind user to log in. Use INR notation for prices.`;
      const prompt = `${system}\n${lastContext}\nUser: ${cleanedMessage}\nAssistant:`;

      const hfReply = await safeSendToLLM(prompt, { temperature: 0.2, max_new_tokens: 200 });
      if (hfReply) {
        session.history.push({ user: cleanedMessage, bot: hfReply, intent: "hf_fallback", ts: Date.now() });
        await saveSession(user._id, session);
        return res.json({ reply: hfReply });
      }
    } catch (e) {
      console.error("HF fallback error", e);
    }

    // final fallback
    return res.json({
      reply:
        "Sorry, I couldn't find an exact answer. I can help with orders, product prices, super coins, or say 'help' to see examples.",
    });
  } catch (err) {
    console.error("aiChatAssistant error", err);
    return res.status(500).json({ reply: "Something went wrong while processing your request." });
  }
};

module.exports = { aiChatAssistant };
