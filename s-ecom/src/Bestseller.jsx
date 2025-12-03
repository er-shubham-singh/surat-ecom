import React from "react";
import { useNavigate } from "react-router-dom";

export const bestsellers = [
  {
    id: 1,
    name: "Oversized Hoodie",
    price: "₹1,299",
    originalPrice: "₹2,499",
    discount: "48% OFF",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800",
    rating: 4.8,
    reviews: 342,
    badge: "#1 Bestseller",
    path: "/women/topwear/ladies_tops",
  },
  {
    id: 2,
    name: "Ethnic Kurti Set",
    price: "₹1,799",
    originalPrice: "₹3,499",
    discount: "49% OFF",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800",
    rating: 4.9,
    reviews: 521,
    badge: "Trending",
    path: "/women/sets/ethnic",
  },
  {
    id: 3,
    name: "Women's Jacket",
    price: "₹2,199",
    originalPrice: "₹4,999",
    discount: "56% OFF",
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=800",
    rating: 4.7,
    reviews: 289,
    badge: "Hot Seller",
    path: "/women/topwear/half-jackets",
  },
  {
    id: 4,
    name: "Casual Top",
    price: "₹699",
    originalPrice: "₹1,499",
    discount: "53% OFF",
    image:
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800",
    rating: 4.6,
    reviews: 418,
    badge: "Popular",
    path: "/women/topwear/ladies_tops",
  },
  {
    id: 5,
    name: "Party Wear Dress",
    price: "₹2,499",
    originalPrice: "₹5,999",
    discount: "58% OFF",
    image:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800",
    rating: 4.9,
    reviews: 673,
    badge: "Customer Favorite",
    path: "/women/dresses/party-wear",
  },
  {
    id: 6,
    name: "Slim Fit Jeans",
    price: "₹1,499",
    originalPrice: "₹2,999",
    discount: "50% OFF",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800",
    rating: 4.5,
    reviews: 234,
    badge: "Best Value",
    path: "/women/jeans/narrow-fit",
  },
];

const Bestseller = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    if (!path) {
      navigate("/");
      return;
    }
    navigate(path);
  };

  return (
    <div className="min-h-screen py-12" style={{ backgroundColor: "#FFF9E8" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12" data-aos="fade-down">
          <div className="inline-block bg-[#DFF200] px-6 py-2 rounded-full mb-4">
            <span className="text-[#111111] font-bold text-sm uppercase tracking-wide">
              ⭐ Customer Favorites
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#111111] mb-4">
            Our Bestsellers
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Discover the most loved products by our customers. These top-rated
            items are flying off the shelves!
          </p>
        </div>

        {/* Bestsellers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bestsellers.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-[#CBE600]/30"
              onClick={() => handleNavigate(product.path)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  handleNavigate(product.path);
              }}
              data-aos="fade-up"
              data-aos-delay={product.id * 100}
            >
              {/* Image with Badge */}
              <div className="relative h-80 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Badge */}
                <div className="absolute top-4 left-4 bg-[#CBE600] text-[#111111] px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  {product.badge}
                </div>
                {/* Discount */}
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  {product.discount}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#111111] mb-2 group-hover:text-[#CBE600] transition-colors">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="font-semibold text-gray-900">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-gray-500 text-sm">
                    ({product.reviews} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-bold text-[#111111]">
                    {product.price}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    {product.originalPrice}
                  </span>
                </div>

                {/* CTA Button */}
                <button
                  onClick={(e) => {
                    // prevent parent click from firing twice (not strictly necessary here but safe)
                    e.stopPropagation();
                    handleNavigate(product.path);
                  }}
                  className="w-full px-6 py-3 bg-[#DFF200] text-[#111111] font-bold rounded-md hover:bg-[#CBE600] transition-colors duration-300 transform hover:scale-105"
                >
                  View collection
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
          data-aos="fade-up"
        >
          <div className="bg-[#DFF200] rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-[#111111] mb-2">10K+</div>
            <div className="text-gray-700 font-medium">Happy Customers</div>
          </div>
          <div className="bg-[#CBE600] rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-[#111111] mb-2">4.8★</div>
            <div className="text-gray-700 font-medium">Average Rating</div>
          </div>
          <div className="bg-[#DFF200] rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-[#111111] mb-2">2.5K+</div>
            <div className="text-gray-700 font-medium">5-Star Reviews</div>
          </div>
        </div>

        {/* CTA Section */}
        <div
          className="mt-12 bg-linear-to-r from-[#DFF200] to-[#CBE600] rounded-lg p-8 md:p-12 text-center"
          data-aos="zoom-in"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#111111] mb-4">
            Want to See More?
          </h2>
          <p className="text-lg text-gray-800 mb-6">
            Explore our full collection and find your perfect style
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-10 py-4 bg-[#111111] text-[#DFF200] font-bold rounded-md hover:bg-gray-900 transition-colors duration-300 transform hover:scale-105"
          >
            Shop All Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default Bestseller;
