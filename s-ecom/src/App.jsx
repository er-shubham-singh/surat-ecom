import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Common/Header";
import Home from "./Home/Home";
import About from "./Pages/About";
import Footer from "./Common/Footer";
import ProductPage from "./Product/Product";
import ProductDetailsPage from "./Product/ProductDetailsPage";
import CartPage from "./Cart/CartPage";
import Order from "./orders/Order";
import OrderDetails from "./orders/OrderDetails";
import Checkout from "./Checkout/Checkout";
import PaymentSuccess from "./paymentSuccess/PaymentSuccess";

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
                <Route path="/account/order" element={<Order />}></Route>
              <Route path="/account/order/:orderId" element={<OrderDetails />}></Route>
        <Route path="/checkout" element={<Checkout />}></Route>

        <Route path="/cart" element={<CartPage />} />
                <Route path="/payment/:orderId" element={<PaymentSuccess />}></Route>

     </Routes>
     <Footer />
    </>
  );
}

export default App;
