import React from "react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();
  return (
    <section
      className="min-h-screen py-16"
      style={{ backgroundColor: "#FFF9E8" }}
    >
      <div className="container mx-auto px-4 flex flex-col lg:flex-row-reverse items-center gap-12">
        {/* 🖼️ Image first on mobile */}
        <div
          className="w-full lg:w-1/2 flex justify-center"
          data-aos="fade-right"
        >
          <img
            src="https://static.vecteezy.com/system/resources/previews/012/335/177/non_2x/online-shopping-concept-with-people-buying-things-in-a-web-online-store-men-and-women-choosing-clothes-in-an-online-shop-e-commerce-and-shopping-online-illustration-in-flat-style-vector.jpg"
            alt="About Venus Garments - Women's Fashion"
            className="max-w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* 📝 Text below image on mobile, to the left on desktop */}
        <div
          className="w-full lg:w-1/2 text-center lg:text-left"
          data-aos="fade-left"
        >
          <h2 className="text-4xl font-bold text-[#111111] mb-6">
            Welcome to <span className="text-[#CBE600]">Venus Garments</span>
          </h2>
          <p className="text-gray-600 mb-4">
            At Venus Garments, we believe fashion is an expression of self-love
            and confidence. Our exclusive collection of women's clothing is
            curated to empower you with elegance, comfort, and timeless style.
          </p>
          <p className="text-gray-600 mb-6">
            Whether you're dressing for a casual day out or a special occasion,
            Venus Garments brings you handpicked styles that embrace every
            moment with grace. Join our community and elevate your wardrobe with
            pieces that speak your story.
          </p>
          <button
            className="bg-[#DFF200] text-[#111111] font-bold px-8 py-3 rounded-md hover:bg-[#CBE600] transition-colors duration-300 shadow-md hover:shadow-lg"
            onClick={() => navigate("/home")}
          >
            Explore Collection
          </button>
        </div>
      </div>
    </section>
  );
};

export default About;
