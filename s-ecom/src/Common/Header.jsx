// src/Common/Header.jsx
import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import navigation from "../Config/navigation";
import RegisterModal from "../Component/auth/Model/RegisterModel";
import AuthModal from "../Component/AuthModel";

const iconButtonClass =
  "p-2.5 rounded-full hover:bg-white/10 focus:bg-white/10 transition-all duration-300 flex items-center justify-center outline-none relative group";

const SearchIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const UserIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const CartIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

const MenuIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const CloseIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const Chevron = ({ open }) => (
  <svg
    className={`w-3.5 h-3.5 transition-transform duration-300 ${
      open ? "rotate-180" : "rotate-0"
    }`}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6 8l4 4 4-4" />
  </svg>
);

export default function Header() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [startWithRegister, setStartWithRegister] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const headerRef = useRef(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount] = useState(3); // Demo cart count
  const hoverTimeout = useRef(null);

  useLayoutEffect(() => {
    const setHeaderHeightVar = () => {
      const el = headerRef.current;
      if (!el) return;
      const height = Math.ceil(el.getBoundingClientRect().height);
      document.documentElement.style.setProperty(
        "--header-height",
        `${height}px`
      );
    };

    setHeaderHeightVar();
    window.addEventListener("resize", setHeaderHeightVar);
    const ro = new ResizeObserver(setHeaderHeightVar);
    if (headerRef.current) ro.observe(headerRef.current);

    return () => {
      window.removeEventListener("resize", setHeaderHeightVar);
      try {
        if (ro && headerRef.current) ro.unobserve(headerRef.current);
      } catch (e) {}
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = (id) => {
    window.clearTimeout(hoverTimeout.current);
    hoverTimeout.current = window.setTimeout(() => setOpenMenu(id), 80);
  };

  const handleMouseLeave = () => {
    window.clearTimeout(hoverTimeout.current);
    hoverTimeout.current = window.setTimeout(() => setOpenMenu(null), 120);
  };

  const handleClickToggle = (e, id) => {
    e.preventDefault();
    setOpenMenu((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`w-full bg-[#DFF200] text-[#111111] sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "shadow-xl" : "shadow-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Top Bar - Desktop Only */}
          <div className="hidden md:flex items-center justify-between py-2 border-b border-[#CBE600]/30 text-sm">
            <div className="flex items-center gap-6 text-[#111111]/70">
              <a
                href="tel:+1234567890"
                className="hover:text-[#111111] transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                +123 456 7890
              </a>
              <a
                href="mailto:info@venus.com"
                className="hover:text-[#111111] transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                info@venus.com
              </a>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[#111111]/70">
                Free Shipping on Orders Over $50
              </span>
              <div className="flex gap-2">
                {["facebook", "instagram", "twitter"].map((social) => (
                  <a
                    key={social}
                    href={`#${social}`}
                    className="w-7 h-7 rounded-full bg-[#CBE600] hover:bg-[#111111] text-[#111111] hover:text-[#DFF200] flex items-center justify-center transition-all duration-300"
                    aria-label={social}
                  >
                    <span className="text-xs font-bold">
                      {social[0].toUpperCase()}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Main Header */}
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <CloseIcon className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </button>

            {/* Logo */}
            <div>
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="bg-[#CBE600] blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                  <img
                    src="logo/logo.jpeg"
                    alt="Venus Garments Logo"
                    className="h-12 rounded-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex flex-1 justify-center px-8">
              <ul className="flex items-center gap-1 font-semibold uppercase tracking-wider text-sm lg:text-base">
                {navigation.map((nav) => {
                  // treat nav with categories as mega menu
                  const isMega =
                    Array.isArray(nav.categories) && nav.categories.length > 0;
                  const isOpen = openMenu === nav.id;
                  return (
                    <li
                      key={nav.id}
                      className="relative"
                      onMouseEnter={() => handleMouseEnter(nav.id)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {isMega ? (
                        <button
                          onClick={(e) => handleClickToggle(e, nav.id)}
                          className={`flex items-center gap-2 px-5 py-3 rounded-lg hover:bg-[#CBE600] transition-all duration-300 font-bold ${
                            isOpen ? "bg-[#CBE600] shadow-lg" : ""
                          }`}
                          aria-expanded={isOpen}
                          aria-haspopup="true"
                        >
                          <span>{nav.title}</span>
                          <Chevron open={isOpen} />
                        </button>
                      ) : (
                        <Link
                          to={nav.path}
                          className="px-5 py-3 rounded-lg hover:bg-[#CBE600] transition-all duration-300 font-bold block"
                        >
                          {nav.title}
                        </Link>
                      )}

                      {isMega && (
                        // Wider dropdown matching the screenshot design
                        <div
                          className={`absolute left-1/2 transform -translate-x-1/2 mt-2 w-[1200px] max-w-[95vw] bg-white text-[#111111] rounded-lg shadow-2xl transition-all duration-300 pointer-events-auto ${
                            isOpen
                              ? "opacity-100 visible translate-y-0"
                              : "opacity-0 invisible -translate-y-4"
                          }`}
                          onMouseEnter={() => handleMouseEnter(nav.id)}
                          onMouseLeave={handleMouseLeave}
                          role="menu"
                          aria-hidden={!isOpen}
                        >
                          <div className="p-10">
                            <div className="grid grid-cols-12 gap-8">
                              {/* Left: categories columns — use 9 cols for more spacing */}
                              <div className="col-span-9 grid grid-cols-4 gap-8">
                                {nav.categories?.map((cat) => (
                                  <div key={cat.id} className="space-y-3">
                                    <h4 className="text-base font-bold tracking-wide text-[#E91E63] mb-4 pb-2 border-b-2 border-[#E91E63]">
                                      {cat.title}
                                    </h4>
                                    <ul className="space-y-2.5">
                                      {cat.subHeadings?.map((item) => (
                                        <li key={item.id}>
                                          <Link
                                            to={item.path || item.href || "#"}
                                            className="block text-[#666] hover:text-[#E91E63] transition-colors text-sm leading-relaxed"
                                          >
                                            {item.name}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>

                              {/* Right: promotional image — use 3 cols */}
                              <div className="col-span-3 flex items-center justify-center">
                                {/* Prefer featured[].imageSrc else nav.images */}
                                {Array.isArray(nav.featured) &&
                                nav.featured.length > 0 ? (
                                  <Link
                                    to={nav.featured[0].href || nav.path || "#"}
                                    className="block rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 w-full"
                                  >
                                    <img
                                      src={nav.featured[0].imageSrc}
                                      alt={nav.featured[0].name}
                                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                  </Link>
                                ) : Array.isArray(nav.images) &&
                                  nav.images.length > 0 ? (
                                  <Link
                                    to={nav.path || "#"}
                                    className="block rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 w-full"
                                  >
                                    <img
                                      src={nav.images[0]}
                                      alt={`${nav.title} promotion`}
                                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                  </Link>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Action Icons */}
            <div className="flex items-center gap-2">
              <button aria-label="Search" className={iconButtonClass}>
                <SearchIcon className="w-6 h-6" />
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#111111] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  Search
                </span>
              </button>

              <button
                aria-label="Account"
                className={iconButtonClass}
                onClick={() => {
                  setStartWithRegister(true);
                  setShowAuthModal(true);
                }}
              >
                <UserIcon className="w-6 h-6" />
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#111111] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  Account
                </span>
              </button>

              {/* Auth Modal */}
              <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                startWithRegister={startWithRegister}
              />

              <button
                aria-label="Cart"
                className={`${iconButtonClass} relative`}
              >
                <CartIcon className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#CBE600] text-[#111111] text-xs font-bold rounded-full flex items-center justify-center border-2 border-[#DFF200] shadow-lg">
                    {cartCount}
                  </span>
                )}
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#111111] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  Cart ({cartCount})
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 md:hidden transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto">
          {/* Mobile Menu Header */}
          <div className="bg-[#DFF200] p-6 flex items-center justify-between border-b-2 border-[#CBE600]">
            <img
              src="https://placehold.co/100x40/111111/DFF200?text=VENUS"
              alt="Logo"
              className="h-10"
            />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className="p-6">
            <ul className="space-y-2">
              {navigation.map((nav) => {
                const isOpen = openMenu === nav.id;
                const isMega =
                  Array.isArray(nav.categories) && nav.categories.length > 0;
                return (
                  <li key={nav.id}>
                    {isMega ? (
                      <div>
                        <button
                          onClick={(e) => handleClickToggle(e, nav.id)}
                          className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-[#DFF200]/30 transition-colors font-semibold uppercase text-sm"
                        >
                          <span>{nav.title}</span>
                          <Chevron open={isOpen} />
                        </button>

                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            isOpen ? "max-h-[2000px] mt-2" : "max-h-0"
                          }`}
                        >
                          <div className="pl-4 space-y-4">
                            {nav.categories?.map((cat) => (
                              <div
                                key={cat.id}
                                className="bg-[#FFFDF6] rounded-lg p-4 border border-[#DFF200]"
                              >
                                <h4 className="text-xs font-bold uppercase tracking-wider text-[#CBE600] mb-3">
                                  {cat.title}
                                </h4>
                                <ul className="space-y-2">
                                  {cat.subHeadings?.map((item) => (
                                    <li key={item.id}>
                                      <Link
                                        to={item.path || item.href || "#"}
                                        onClick={() => {
                                          setMobileMenuOpen(false);
                                          setOpenMenu(null);
                                        }}
                                        className="block p-2 rounded-lg hover:bg-[#DFF200]/50 transition-colors"
                                      >
                                        <span className="text-sm font-medium">
                                          {item.name}
                                        </span>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Link
                        to={nav.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-3 rounded-lg hover:bg-[#DFF200]/30 transition-colors font-semibold uppercase text-sm"
                      >
                        {nav.title}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Mobile Contact Info */}
          <div className="p-6 border-t border-gray-200 bg-[#FFFDF6]">
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-[#CBE600]">
              Contact Us
            </h4>
            <div className="space-y-3 text-sm">
              <a
                href="tel:+1234567890"
                className="flex items-center gap-3 text-gray-700 hover:text-[#CBE600] transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                +123 456 7890
              </a>
              <a
                href="mailto:info@venus.com"
                className="flex items-center gap-3 text-gray-700 hover:text-[#CBE600] transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                info@venus.com
              </a>
            </div>
          </div>
        </div>
      </div>
      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
      />
    </>
  );
}
