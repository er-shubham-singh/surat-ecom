import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Common/Header";
import Home from "./Home/Home";
import About from "./Pages/About";
import Footer from "./Common/Footer";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
     </Routes>
     <Footer />
    </>
  );
}

export default App;
