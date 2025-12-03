// utils/mailer.js
require("dotenv").config();
const transporter = require("../config/transporter");

function formatCurrency(amount) {
  return `₹${Number(amount || 0).toFixed(2)}`;
}

function buildItemsTable(orderItems) {
  return orderItems
    .map(
      (it) => `
    <tr>
      <td style="padding:8px 10px; border-bottom:1px solid #e9e9e9; font-size:14px;">
        ${it.product.title}
        ${it.size ? `<div style="color:#777; font-size:12px;">Size: ${it.size}</div>` : ""}
      </td>
      <td style="padding:8px 10px; border-bottom:1px solid #e9e9e9; text-align:center; font-size:14px;">${it.quantity}</td>
      <td style="padding:8px 10px; border-bottom:1px solid #e9e9e9; text-align:right; font-size:14px;">${formatCurrency(it.product.price)}</td>
    </tr>`
    )
    .join("");
}

async function sendOrderConfirmationEmail(to, order) {
  const logoUrl =
    process.env.COMPANY_LOGO_URL ||
    "https://via.placeholder.com/160x40?text=Venus+Garments";

  const itemsTableRows = buildItemsTable(order.orderItems || []);

  const html = `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Order Confirmation - Venus Garments</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f5f7fb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table width="680" cellpadding="0" cellspacing="0" role="presentation" style="max-width:680px; width:100%; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 6px 18px rgba(20,24,40,0.06);">
            <!-- Header -->
            <tr>
              <td style="padding:20px 28px; border-bottom:1px solid #eef2f6;">
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td style="vertical-align:middle;">
                      <img src="${logoUrl}" alt="Venus Garments" width="160" style="display:block; height:auto;"/>
                    </td>
                    <td style="text-align:right; vertical-align:middle; color:#6b7280; font-size:13px;">
                      <div style="font-weight:600; color:#111827">Order Confirmation</div>
                      <div style="margin-top:4px;">${new Date(order.orderDate || Date.now()).toLocaleString()}</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Greeting -->
            <tr>
              <td style="padding:22px 28px;">
                <h1 style="margin:0 0 8px 0; font-size:20px; color:#0f172a; font-weight:700;">Thanks for your order, ${order.user?.firstName || "Customer"}!</h1>
                <p style="margin:0; color:#475569; font-size:14px; line-height:1.5;">
                  We've received your order <strong>${order._id}</strong> and are processing it. Below are the details — we’ll notify you when it ships.
                </p>
              </td>
            </tr>

            <!-- Order summary -->
            <tr>
              <td style="padding:0 28px 22px 28px;">
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-radius:6px; overflow:hidden; border:1px solid #eef2f6;">
                  <thead>
                    <tr style="background:#fafafa;">
                      <th align="left" style="padding:10px 12px; font-size:13px; color:#111827; border-bottom:1px solid #eef2f6;">Item</th>
                      <th align="center" style="padding:10px 12px; font-size:13px; color:#111827; border-bottom:1px solid #eef2f6;">Qty</th>
                      <th align="right" style="padding:10px 12px; font-size:13px; color:#111827; border-bottom:1px solid #eef2f6;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsTableRows}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="2" style="padding:10px 12px; font-size:14px; color:#374151; border-top:1px solid #eef2f6;">Subtotal</td>
                      <td style="padding:10px 12px; text-align:right; font-weight:600; color:#111827; border-top:1px solid #eef2f6;">${formatCurrency(order.totalPrice)}</td>
                    </tr>
                    <tr>
                      <td colspan="2" style="padding:8px 12px; font-size:14px; color:#374151;">Discount</td>
                      <td style="padding:8px 12px; text-align:right; color:#111827;">- ${formatCurrency((order.couponDiscount || 0) + (order.usedSuperCoins || 0))}</td>
                    </tr>
                    <tr>
                      <td colspan="2" style="padding:12px; font-size:16px; color:#111827; font-weight:700;">Total</td>
                      <td style="padding:12px; text-align:right; font-size:16px; color:#111827; font-weight:700;">${formatCurrency(order.totalDiscountedPrice)}</td>
                    </tr>
                  </tfoot>
                </table>
              </td>
            </tr>

            <!-- Shipping & CTA -->
            <tr>
              <td style="padding:0 28px 22px 28px;">
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td width="50%" valign="top" style="padding-right:12px;">
                      <div style="font-size:13px; color:#374151; margin-bottom:8px; font-weight:600;">Shipping Address</div>
                      <div style="font-size:14px; color:#111827; line-height:1.4;">
                        ${order.shippingAddress?.firstName || ""} ${order.shippingAddress?.lastName || ""}<br/>
                        ${order.shippingAddress?.streetAddress || ""}<br/>
                        ${order.shippingAddress?.city || ""}, ${order.shippingAddress?.state || ""} - ${order.shippingAddress?.zipCode || ""}<br/>
                        ${order.shippingAddress?.phone || ""}
                      </div>
                    </td>

                    <td width="50%" valign="top" style="padding-left:12px;">
                      <div style="font-size:13px; color:#374151; margin-bottom:8px; font-weight:600;">Order Info</div>
                      <div style="font-size:14px; color:#111827; line-height:1.6;">
                        <div><strong>Order ID:</strong> ${order._id}</div>
                        <div><strong>Status:</strong> ${order.orderStatus}</div>
                        <div><strong>Payment:</strong> ${order.paymentDetails?.paymentStatus || "PENDING"}</div>
                      </div>

                      <div style="margin-top:14px;">
                        <a href="${process.env.ORDER_TRACKING_URL || "#"}" style="display:inline-block; text-decoration:none; padding:10px 16px; border-radius:8px; background:#0b74ff; color:#ffffff; font-weight:600; font-size:14px;">
                          View order
                        </a>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer note -->
            <tr>
              <td style="padding:18px 28px 28px 28px; border-top:1px solid #f1f5f9; background:#ffffff;">
                <p style="margin:0; color:#6b7280; font-size:13px; line-height:1.5;">
                  If you have any questions, reply to this email or contact our support at <a href="mailto:${process.env.SUPPORT_EMAIL || "support@venusgarments.com"}" style="color:#0b74ff; text-decoration:none;">${process.env.SUPPORT_EMAIL || "support@venusgarments.com"}</a>.
                </p>

                <p style="margin:12px 0 0 0; color:#9aa4b2; font-size:12px;">
                  Venus Garments<br/>
                  ${process.env.COMPANY_ADDRESS || "Your Company Address"}
                </p>
              </td>
            </tr>

            <!-- small footer -->
            <tr>
              <td style="padding:14px 28px; text-align:center; font-size:12px; color:#9aa4b2;">
                <span>© ${new Date().getFullYear()} Venus Garments. All rights reserved.</span>
                <br/>
                <a href="${process.env.UNSUBSCRIBE_URL || "#"}" style="color:#9aa4b2; text-decoration:underline;">Unsubscribe</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  // Plain-text fallback
  const text = `
  Thank you for your order, ${order.user?.firstName || "Customer"}!
  Order ID: ${order._id}
  Status: ${order.orderStatus}
  Date: ${new Date(order.orderDate || Date.now()).toLocaleString()}

  Items:
  ${order.orderItems
    .map((it) => `- ${it.product.title} (Qty: ${it.quantity}) - ${formatCurrency(it.product.price)}`)
    .join("\n")}

  Total: ${formatCurrency(order.totalDiscountedPrice)}

  View your order: ${process.env.ORDER_TRACKING_URL || "Visit your account to see details."}
  `;

  console.log("EMAIL DEBUG >> sending to:", to);

  try {
    const info = await transporter.sendMail({
      from: `"Venus Garments" <${process.env.SMTP_USER}>`,
      to,
      subject: `Order Confirmation — ${order._id}`,
      html,
      text,
    });
    console.log("✅ Email sent:", info.messageId || info.response);
  } catch (err) {
    console.error("❌ Failed to send email:", err && err.message ? err.message : err);
  }
}

module.exports = { sendOrderConfirmationEmail };
