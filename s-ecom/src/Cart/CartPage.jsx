import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, Truck, Tag, Lock, ArrowRight, Heart, Trash2 } from 'lucide-react';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Glowfly Liquid Highlighter",
      price: 399,
      originalPrice: 599,
      quantity: 2,
      color: "Rose Pink",
      size: "M",
      image: "https://images.unsplash.com/photo-1596704017254-9b121068ec31?auto=format&fit=crop&w=400&q=80",
      inStock: true
    },
    {
      id: 2,
      name: "Velvet Matte Lipstick",
      price: 699,
      originalPrice: 899,
      quantity: 1,
      color: "Ruby Red",
      size: "Standard",
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80",
      inStock: true
    },
    {
      id: 3,
      name: "Silk Finish Foundation",
      price: 1599,
      originalPrice: 1999,
      quantity: 1,
      color: "Ivory",
      size: "30ml",
      image: "https://images.unsplash.com/photo-1631730486572-226d1f595b68?auto=format&fit=crop&w=400&q=80",
      inStock: true
    }
  ]);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'SAVE10') {
      setAppliedCoupon({ code: 'SAVE10', discount: 10 });
    } else if (couponCode.toUpperCase() === 'WELCOME20') {
      setAppliedCoupon({ code: 'WELCOME20', discount: 20 });
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = cartItems.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const couponDiscount = appliedCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0;
  const total = subtotal + shipping - couponDiscount;

  const recommendedProducts = [
    {
      id: 101,
      name: "Pearl Blush Duo",
      price: 749,
      image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 102,
      name: "Volume Max Mascara",
      price: 549,
      image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 103,
      name: "Luxe Makeup Brush Set",
      price: 1899,
      image: "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?auto=format&fit=crop&w=400&q=80"
    }
  ];

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFFDF6] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-32 h-32 mx-auto mb-8 bg-[#CBE600]/10 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-16 h-16 text-[#8A6F4F]" />
          </div>
          <h1 className="text-3xl font-serif font-semibold text-[#222426] mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <a
            href="/products"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#CBE600] text-white font-bold rounded-xl hover:bg-[#DFF200] hover:text-black transition-all duration-300 shadow-lg uppercase tracking-wide"
          >
            Continue Shopping
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF6]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#8A6F4F] to-[#6B5B4A] text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 text-sm mb-4 text-white/80">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span>/</span>
            <span>Shopping Cart</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-light mb-2">Shopping Cart</h1>
          <p className="text-lg text-white/90">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Free Shipping Banner */}
            {subtotal < 999 && (
              <div className="bg-gradient-to-r from-[#CBE600]/20 to-[#DFF200]/20 border-2 border-[#CBE600] rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <Truck className="w-6 h-6 text-[#8A6F4F]" />
                  <div className="flex-1">
                    <p className="font-semibold text-[#222426]">
                      Add ₹{999 - subtotal} more to get FREE shipping!
                    </p>
                    <div className="w-full bg-white rounded-full h-2 mt-2 overflow-hidden">
                      <div 
                        className="h-full bg-[#CBE600] transition-all duration-500"
                        style={{ width: `${(subtotal / 999) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cart Items List */}
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex gap-6">
                  {/* Product Image */}
                  <div className="w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-[#222426] mb-1 hover:text-[#8A6F4F] transition-colors cursor-pointer">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span>Color: <span className="font-medium text-[#222426]">{item.color}</span></span>
                          <span>•</span>
                          <span>Size: <span className="font-medium text-[#222426]">{item.size}</span></span>
                        </div>
                        {item.inStock ? (
                          <span className="text-xs text-[#CBE600] font-semibold">In Stock</span>
                        ) : (
                          <span className="text-xs text-red-500 font-semibold">Out of Stock</span>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove item"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="flex items-center gap-3">
                          <span className="text-xl font-bold text-[#8A6F4F]">₹{item.price * item.quantity}</span>
                          {item.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">₹{item.originalPrice * item.quantity}</span>
                          )}
                        </div>
                        {item.originalPrice && (
                          <span className="text-xs text-[#CBE600] font-semibold">
                            Save ₹{(item.originalPrice - item.price) * item.quantity}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 mt-4 pt-4 border-t border-gray-200">
                      <button className="flex items-center gap-2 text-sm text-[#8A6F4F] hover:text-[#CBE600] transition-colors font-medium">
                        <Heart className="w-4 h-4" />
                        Save for Later
                      </button>
                      <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-500 transition-colors font-medium">
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <a
              href="/products"
              className="inline-flex items-center gap-2 text-[#8A6F4F] font-semibold hover:gap-3 transition-all duration-300"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
              Continue Shopping
            </a>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-serif font-semibold text-[#222426] mb-6">Order Summary</h2>

              {/* Coupon Code */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <label className="block text-sm font-semibold text-[#222426] mb-3">Have a Coupon?</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#CBE600] focus:outline-none focus:ring-2 focus:ring-[#CBE600]/20 transition-all"
                  />
                  <button
                    onClick={applyCoupon}
                    className="px-6 py-3 bg-[#8A6F4F] text-white font-semibold rounded-lg hover:bg-[#CBE600] hover:text-black transition-all duration-300"
                  >
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-[#CBE600] font-semibold">
                    <Tag className="w-4 h-4" />
                    Coupon "{appliedCoupon.code}" applied! {appliedCoupon.discount}% off
                  </div>
                )}
                <div className="mt-3 space-y-1">
                  <p className="text-xs text-gray-500">Try: <span className="font-semibold text-[#8A6F4F]">SAVE10</span> or <span className="font-semibold text-[#8A6F4F]">WELCOME20</span></p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="font-semibold">₹{subtotal}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-[#CBE600] font-semibold">
                    <span>You Save</span>
                    <span>-₹{savings}</span>
                  </div>
                )}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-[#CBE600] font-semibold">
                    <span>Coupon Discount</span>
                    <span>-₹{couponDiscount.toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="font-semibold text-[#CBE600]">FREE</span>
                  ) : (
                    <span className="font-semibold">₹{shipping}</span>
                  )}
                </div>
                <div className="pt-4 border-t-2 border-gray-200 flex justify-between text-xl font-bold text-[#222426]">
                  <span>Total</span>
                  <span className="text-[#8A6F4F]">₹{total.toFixed(0)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button className="w-full py-4 px-6 bg-[#CBE600] text-white font-bold text-lg rounded-xl hover:bg-[#DFF200] hover:text-black transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 uppercase tracking-wide mb-4">
                Proceed to Checkout
              </button>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Lock className="w-4 h-4" />
                <span>Secure Checkout</span>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="w-10 h-10 bg-[#CBE600]/10 rounded-full flex items-center justify-center">
                    <Truck className="w-5 h-5 text-[#8A6F4F]" />
                  </div>
                  <div>
                    <p className="font-semibold">Free Shipping</p>
                    <p className="text-xs text-gray-500">On orders over ₹999</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="w-10 h-10 bg-[#CBE600]/10 rounded-full flex items-center justify-center">
                    <Lock className="w-5 h-5 text-[#8A6F4F]" />
                  </div>
                  <div>
                    <p className="font-semibold">Secure Payment</p>
                    <p className="text-xs text-gray-500">100% protected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="mt-16">
          <h2 className="text-3xl font-serif font-semibold text-[#8A6F4F] mb-8 text-center">
            Complete Your Look
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedProducts.map((product) => (
              <article key={product.id} className="group bg-white rounded-xl overflow-hidden shadow-lg border-2 border-transparent hover:border-[#DFF200] transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                <div className="relative overflow-hidden bg-gray-100 aspect-square">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold text-[#222426] mb-3 group-hover:text-[#CBE600] transition-colors duration-300 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-[#8A6F4F]">₹{product.price}</span>
                    <button className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-[#CBE600] hover:text-black transition-all duration-300 uppercase">
                      Add
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;