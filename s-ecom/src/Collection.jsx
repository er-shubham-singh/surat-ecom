import React from "react";
import { useNavigate } from "react-router-dom";

const Collection = () => {
  const navigate = useNavigate();

  const collections = [
    {
      id: 1,
      title: "Winter Collection",
      description: "Stay warm and stylish with our exclusive winter range",
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800",
      category: "women",
      path: "/women/coats/full-length", // ADDED
    },
    {
      id: 2,
      title: "Summer Essentials",
      description: "Light, breezy, and perfect for sunny days",
      image:
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800",
      category: "women",
      path: "/women/topwear/ladies_tops", // ADDED
    },
    {
      id: 3,
      title: "Ethnic Wear",
      description: "Traditional styles meet modern elegance",
      image:
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800",
      category: "women",
      path: "/women/sets/ethnic", // ADDED
    },
    {
      id: 4,
      title: "Party Wear",
      description: "Shine bright at every celebration",
      image:
        "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800",
      category: "women",
      path: "/women/dresses/party-wear", // ADDED
    },
    {
      id: 5,
      title: "Casual Comfort",
      description: "Everyday wear that feels like a dream",
      image:
        "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=800",
      category: "women",
      path: "/women/topwear/ladies_tops", // ADDED
    },
    {
      id: 6,
      title: "Men's Formals",
      description: "Sharp, sophisticated, and office-ready",
      image:
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800",
      category: "men",
      path: "/men/topwear/shirts", // ADDED
    },
  ];

  return (
    <div className="min-h-screen py-12" style={{ backgroundColor: "#FFF9E8" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12" data-aos="fade-down">
          <h1 className="text-4xl md:text-5xl font-bold text-[#111111] mb-4">
            Our Collections
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Explore our curated collections designed to elevate your style. From
            seasonal favorites to timeless classics.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-[#CBE600]/20"
              onClick={() => navigate(collection.path)} // UPDATED
              data-aos="fade-up"
              data-aos-delay={collection.id * 100}
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#111111] mb-2 group-hover:text-[#CBE600] transition-colors">
                  {collection.title}
                </h3>
                <p className="text-gray-600 mb-4">{collection.description}</p>

                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevents double click navigation
                    navigate(collection.path);
                  }}
                  className="px-6 py-2 bg-[#DFF200] text-[#111111] font-semibold rounded-md hover:bg-[#CBE600] transition-colors duration-300"
                >
                  View Collection
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div
          className="mt-16 bg-[#DFF200] rounded-lg p-8 md:p-12 text-center"
          data-aos="zoom-in"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#111111] mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Browse our full catalog or contact us for personalized
            recommendations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3 bg-[#CBE600] text-[#111111] font-bold rounded-md hover:bg-[#111111] hover:text-[#DFF200] transition-colors duration-300"
            >
              Browse All Products
            </button>
            <button
              onClick={() => navigate("/contact-us")}
              className="px-8 py-3 bg-white text-[#111111] font-bold rounded-md border-2 border-[#CBE600] hover:bg-[#CBE600] transition-colors duration-300"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
