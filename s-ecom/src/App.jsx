import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Common/Header";
import Home from "./Home/Home";
import About from "./Pages/About";
import Footer from "./Common/Footer";
import ProductPage from "./Product/Product";
import ProductDetailsPage from "./Product/ProductDetailsPage";
import CartPage from "./Cart/CartPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Header />
      <Routes>
             <Route path="/login" element={<Home />}></Route>
     <Route path="/register" element={<Home />}></Route>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/:lavelOne/:lavelTwo/:lavelThree" element={<ProductPage />} />
        <Route path="/product/:productId" element={ <ProductDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />
     </Routes>
     <Footer />
    </>
  );
}

export default App;
