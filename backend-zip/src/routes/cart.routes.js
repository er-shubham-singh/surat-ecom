const express=require("express");
const authenticate = require("../middleware/authenticat.js");
const router=express.Router();
const cartController=require("../controllers/cart.controller.js")
const { applyCouponToCart } = require("../services/cart.service.js");

// GET: /api/cart
router.get("/", authenticate, cartController.findUserCart);

// PUT: /api/cart/add
router.put("/add", authenticate, cartController.addItemToCart);
router.post("/apply-cart-coupon", authenticate, cartController.applyCouponToCart);
router.get("/all-coupon",authenticate,cartController.allCoupon)

module.exports=router;