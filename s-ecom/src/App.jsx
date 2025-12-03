import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Common/Header";
import Home from "./Home/Home";
import Footer from "./Common/Footer";
import ProductPage from "./Product/Product";
import ProductDetailsPage from "./Product/ProductDetailsPage";
import CartPage from "./Cart/CartPage";
import Order from "./orders/Order";
import OrderDetails from "./orders/OrderDetails";
import Checkout from "./Checkout/Checkout";
import PaymentSuccess from "./paymentSuccess/PaymentSuccess";
import RateProduct from "./ReviewProduct/RateProduct";
import Contact from "./Pages/Contact";
import TearmsCondition from "./Pages/TearmsCondition";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import About from "./Pages/About";
import NotFound from "./Pages/Notfound";
import ChatWidget from "./ChatAi/ChatWidget";
import { loadUserFromToken } from "./redux/Auth/action";
import { useDispatch } from "react-redux";
import Collection from "./Collection";
import Bestseller from "./Bestseller";

import AOS from "aos";
import "aos/dist/aos.css";

function App() {
  const dispatch = useDispatch();

  const [count, setCount] = useState(0);
  useEffect(() => {
    dispatch(loadUserFromToken());
    AOS.init({
      duration: 500,
      easing: "ease-in-out",
      once: true,
    });
  }, [dispatch]);
  return (
    <>
      <Header />
      <Routes>
        <Route path="/login" element={<Home />}></Route>
        <Route path="/register" element={<Home />}></Route>
        <Route path="/" element={<Home />} />
        <Route
          path="/:lavelOne/:lavelTwo/:lavelThree"
          element={<ProductPage />}
        />
        <Route path="/product/:productId" element={<ProductDetailsPage />} />
        <Route path="/account/order" element={<Order />}></Route>
        <Route
          path="/account/order/:orderId"
          element={<OrderDetails />}
        ></Route>
        <Route path="/checkout" element={<Checkout />}></Route>

        <Route path="/cart" element={<CartPage />} />
        <Route path="/payment/:orderId" element={<PaymentSuccess />}></Route>
        <Route
          path="/account/rate/:productId"
          element={<RateProduct />}
        ></Route>
        <Route path="/privaciy-policy" element={<PrivacyPolicy />}></Route>
        <Route path="/terms-condition" element={<TearmsCondition />}></Route>
        <Route path="/contact-us" element={<Contact />}></Route>
        <Route path="/about-us" element={<About />}></Route>
        <Route path="/collection" element={<Collection />}></Route>
        <Route path="/bestseller" element={<Bestseller />}></Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ChatWidget />
      <Footer />
    </>
  );
}

export default App;
