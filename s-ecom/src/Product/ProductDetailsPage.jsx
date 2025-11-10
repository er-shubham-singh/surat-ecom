import React, { useState } from 'react';
import { Star, StarOff, Heart, Share2, ShoppingBag, Truck, RefreshCw, Shield, ChevronLeft, ChevronRight, Check, Minus, Plus } from 'lucide-react';

const ProductDetailsPage = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Rose Pink');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isFavorite, setIsFavorite] = useState(false);

  const product = {
    name: "Glowfly Liquid Highlighter",
    price: 399,
    originalPrice: 599,
    rating: 5,
    reviews: 24,
    sku: "VG-GLH-001",
    availability: "In Stock",
    description: "Illuminate your natural beauty with our Glowfly Liquid Highlighter. This weightless, buildable formula delivers a luminous glow that enhances your features without looking overly shimmery. Perfect for all skin tones, it blends seamlessly and lasts all day.",
    images: [
      "https://images.unsplash.com/photo-1596704017254-9b121068ec31?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=80"
    ],
    colors: [
      { name: "Rose Pink", hex: "#FFC0CB" },
      { name: "Champagne Gold", hex: "#FFD700" },
      { name: "Bronze", hex: "#CD7F32" },
      { name: "Pearl", hex: "#F0EAD6" }
    ],
    sizes: ['S', 'M', 'L'],
    features: [
      "Lightweight, buildable formula",
      "Long-lasting radiant finish",
      "Suitable for all skin types",
      "Cruelty-free & vegan",
      "Dermatologically tested",
      "Easy to blend"
    ],
    ingredients: "Aqua, Mica, Glycerin, Titanium Dioxide, Dimethicone, Phenoxyethanol, Tocopheryl Acetate, Fragrance",
    howToUse: "Apply a small amount to the high points of your face - cheekbones, brow bones, bridge of nose, and cupid's bow. Blend with fingertips, brush, or sponge for a natural glow."
  };

  const relatedProducts = [
    {
      id: 1,
      name: "Velvet Matte Lipstick",
      price: 699,
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80",
      rating: 4
    },
    {
      id: 2,
      name: "Pearl Blush Duo",
      price: 749,
      image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=400&q=80",
      rating: 5
    },
    {
      id: 3,
      name: "Volume Max Mascara",
      price: 549,
      image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=400&q=80",
      rating: 5
    },
    {
      id: 4,
      name: "Silk Finish Foundation",
      price: 1599,
      image: "https://images.unsplash.com/photo-1631730486572-226d1f595b68?auto=format&fit=crop&w=400&q=80",
      rating: 4
    }
  ];

  const reviews = [
    {
      id: 1,
      author: "Priya Sharma",
      rating: 5,
      date: "2025-01-05",
      comment: "Absolutely love this highlighter! It gives such a natural glow without being too glittery. Perfect for everyday wear.",
      verified: true
    },
    {
      id: 2,
      author: "Anjali Mehta",
      rating: 5,
      date: "2024-12-28",
      comment: "Best highlighter I've ever used! The formula is smooth and blends beautifully. Highly recommend!",
      verified: true
    },
    {
      id: 3,
      author: "Neha Kapoor",
      rating: 4,
      date: "2024-12-15",
      comment: "Great product! Love the glow it gives. Only wish it came in more shades.",
      verified: true
    }
  ];

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= rating ? (
              <Star className="w-4 h-4 fill-[#CBE600] text-[#CBE600]" />
            ) : (
              <StarOff className="w-4 h-4 text-gray-300" />
            )}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FFFDF6]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <a href="/" className="hover:text-[#8A6F4F] transition-colors">Home</a>
            <span>/</span>
            <a href="/products" className="hover:text-[#8A6F4F] transition-colors">Products</a>
            <span>/</span>
            <span className="text-[#8A6F4F] font-medium">Glowfly Liquid Highlighter</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Product Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl aspect-square group">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <button
                onClick={() => setSelectedImage(selectedImage === 0 ? product.images.length - 1 : selectedImage - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-[#DFF200] transition-all duration-300 hover:scale-110"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setSelectedImage(selectedImage === product.images.length - 1 ? 0 : selectedImage + 1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-[#DFF200] transition-all duration-300 hover:scale-110"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              
              {/* Discount Badge */}
              <div className="absolute top-6 left-6 px-4 py-2 bg-red-500 text-white font-bold text-sm rounded-full shadow-lg">
                33% OFF
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative bg-white rounded-lg overflow-hidden aspect-square border-2 transition-all duration-300 ${
                    selectedImage === idx ? 'border-[#CBE600] shadow-lg scale-105' : 'border-gray-200 hover:border-[#DFF200]'
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-semibold text-[#222426] mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  {renderStars(product.rating)}
                  <span className="text-sm text-gray-600">({product.reviews} reviews)</span>
                </div>
                <span className="text-sm text-[#CBE600] font-semibold">{product.availability}</span>
              </div>
              <p className="text-sm text-gray-500">SKU: {product.sku}</p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 pb-6 border-b border-gray-200">
              <span className="text-4xl font-bold text-[#8A6F4F]">Rs. {product.price}</span>
              <span className="text-2xl text-gray-400 line-through">Rs. {product.originalPrice}</span>
              <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded-full">
                Save Rs. {product.originalPrice - product.price}
              </span>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-semibold text-[#222426] mb-3">
                Color: <span className="text-[#8A6F4F]">{selectedColor}</span>
              </label>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`relative w-12 h-12 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
                      selectedColor === color.name ? 'border-[#CBE600] shadow-lg scale-110' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selectedColor === color.name && (
                      <Check className="w-6 h-6 text-white absolute inset-0 m-auto drop-shadow-lg" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <label className="block text-sm font-semibold text-[#222426] mb-3">Size</label>
              <div className="flex gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-16 h-12 rounded-lg border-2 font-semibold transition-all duration-300 ${
                      selectedSize === size
                        ? 'border-[#CBE600] bg-[#CBE600] text-white shadow-lg'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-[#DFF200]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold text-[#222426] mb-3">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-16 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">Only 12 items left in stock!</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button className="flex-1 py-4 px-6 bg-[#CBE600] text-white font-bold text-lg rounded-xl hover:bg-[#DFF200] hover:text-black transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-2xl hover:-translate-y-1 uppercase tracking-wide">
                <ShoppingBag className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                  isFavorite ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                }`}
              >
                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </button>
              <button className="w-16 h-16 rounded-xl border-2 border-gray-300 bg-white flex items-center justify-center hover:border-[#CBE600] hover:bg-[#CBE600]/10 transition-all duration-300 hover:scale-110">
                <Share2 className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Buy Now Button */}
            <button className="w-full py-4 px-6 bg-black text-white font-bold text-lg rounded-xl hover:bg-[#8A6F4F] transition-all duration-300 shadow-lg uppercase tracking-wide">
              Buy Now
            </button>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-[#CBE600]/10 rounded-full flex items-center justify-center">
                  <Truck className="w-6 h-6 text-[#8A6F4F]" />
                </div>
                <p className="text-xs font-semibold text-gray-700">Free Shipping</p>
                <p className="text-xs text-gray-500">On orders over ₹999</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-[#CBE600]/10 rounded-full flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-[#8A6F4F]" />
                </div>
                <p className="text-xs font-semibold text-gray-700">Easy Returns</p>
                <p className="text-xs text-gray-500">30-day return policy</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-[#CBE600]/10 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#8A6F4F]" />
                </div>
                <p className="text-xs font-semibold text-gray-700">Secure Payment</p>
                <p className="text-xs text-gray-500">100% protected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <div className="border-b border-gray-200 mb-8">
            <div className="flex gap-8">
              {['description', 'ingredients', 'how-to-use', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 px-2 font-semibold capitalize transition-all duration-300 ${
                    activeTab === tab
                      ? 'text-[#8A6F4F] border-b-2 border-[#CBE600]'
                      : 'text-gray-500 hover:text-[#8A6F4F]'
                  }`}
                >
                  {tab.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'description' && (
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
              <div>
                <h3 className="text-xl font-semibold text-[#222426] mb-4">Key Features:</h3>
                <ul className="grid grid-cols-2 gap-3">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#CBE600] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div>
              <h3 className="text-xl font-semibold text-[#222426] mb-4">Ingredients:</h3>
              <p className="text-gray-700 leading-relaxed">{product.ingredients}</p>
            </div>
          )}

          {activeTab === 'how-to-use' && (
            <div>
              <h3 className="text-xl font-semibold text-[#222426] mb-4">How to Use:</h3>
              <p className="text-gray-700 leading-relaxed">{product.howToUse}</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-4xl font-bold text-[#8A6F4F]">{product.rating}.0</span>
                    <div>
                      {renderStars(product.rating)}
                      <p className="text-sm text-gray-600 mt-1">Based on {product.reviews} reviews</p>
                    </div>
                  </div>
                </div>
                <button className="px-6 py-3 border-2 border-[#8A6F4F] text-[#8A6F4F] rounded-lg hover:bg-[#8A6F4F] hover:text-white transition-all duration-300 font-semibold">
                  Write a Review
                </button>
              </div>

              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-[#222426]">{review.author}</span>
                          {review.verified && (
                            <span className="px-2 py-1 bg-[#CBE600]/10 text-[#8A6F4F] text-xs font-semibold rounded">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-[#8A6F4F] mb-4">
              You May Also Like
            </h2>
            <p className="text-gray-600">Complete your beauty collection with these essentials</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <article key={item.id} className="group bg-white rounded-xl overflow-hidden shadow-lg border-2 border-transparent hover:border-[#DFF200] transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                <div className="relative overflow-hidden bg-gray-100 aspect-square">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold text-[#222426] mb-2 group-hover:text-[#CBE600] transition-colors duration-300 line-clamp-2">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    {renderStars(item.rating)}
                  </div>
                  <div className="mb-4">
                    <span className="text-xl font-bold text-[#8A6F4F]">Rs. {item.price}</span>
                  </div>
                  <button className="w-full py-3 px-4 bg-black text-white text-sm font-semibold rounded-lg hover:bg-[#CBE600] hover:text-black transition-all duration-300 uppercase tracking-wide">
                    Add to bag
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;