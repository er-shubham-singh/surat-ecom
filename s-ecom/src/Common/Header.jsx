// src/Common/Header.jsx
import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import navigation from "../Config/navigation";
import AuthModal from "../Component/auth/AuthModal";
import { getUser, logout } from "../redux/Auth/action";
import { getCart } from "../redux/Cart/Action";

import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { Button } from "@mui/material";
import AddsBar from "../AddsBar";

const iconButtonClass =
  "p-2.5 rounded-full hover:bg-white/10 focus:bg-white/10 transition-all duration-300 flex items-center justify-center outline-none relative group";

/* SVG icons (unchanged) */
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // single source of truth for auth modal
  const [openAuthModal, setOpenAuthModal] = useState(false);

  // Redux state (defensive)
  const auth = useSelector((store) => store.auth);
  const cart = useSelector((store) => store.cart);
  const jwt = localStorage.getItem("jwt");
  const { user, isAuthenticated } = auth;

  const headerRef = useRef(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const hoverTimeout = useRef(null);

  // profile dropdown state
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Helpers for auth modal
  const handleOpenAuth = () => setOpenAuthModal(true);
  const handleCloseAuth = () => setOpenAuthModal(false);

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

  // click outside to close profile dropdown
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [profileOpen]);

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

  const handleLogout = () => {
    dispatch(logout());
    setProfileOpen(false);
    navigate("/", { replace: true });
  };

  // derive display name safely
  const getDisplayName = (u) => {
    if (!u) return "";
    if (u.name) return u.name;
    const f = u.firstName || u.firstname || u.first_name;
    const l = u.lastName || u.lastname || u.last_name;
    if (f && l) return `${f} ${l}`;
    if (f) return f;
    if (u.email) return u.email.split("@")[0];
    return "User";
  };

  useEffect(() => {
    if (jwt) {
      try {
        dispatch(getUser(jwt));
      } catch (e) {}
      try {
        dispatch(getCart(jwt));
      } catch (e) {}
    }
  }, [jwt, dispatch]);

  // handle navigation params (otp handling) -> open auth modal
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const otpId = params.get("otp_id");
    if (otpId) setOpenAuthModal(true);
  }, [location]);

  // close auth modal when user logs in / prevent direct login/register route for non-admin
  useEffect(() => {
    if (auth.user) handleCloseAuth();
    if (
      auth.user?.role !== "ADMIN" &&
      (location.pathname === "/login" || location.pathname === "/register")
    ) {
      navigate(-1);
    }
  }, [auth.user, location.pathname, navigate]);

  const displayName = getDisplayName(user);
  const firstChar = displayName
    ? displayName.trim().charAt(0).toUpperCase()
    : null;

  // robust logged-in flag: use auth.isAuthenticated OR presence of user object
  const loggedIn = Boolean(isAuthenticated) || Boolean(user);

  return (
    <>
      <header
        ref={headerRef}
        className={`w-full bg-[#DFF200] text-[#111111] sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "shadow-xl" : "shadow-md"
        }`}
      >
        <AddsBar />
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Top Bar - Desktop Only */}
          {/* <div className="flex flex-col sm:flex-row items-center justify-between py-2 border-b border-[#CBE600]/30 text-xs sm:text-sm gap-2">
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 text-[#111111]/70 flex-wrap justify-center sm:justify-start">
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
                <span>+123 456 7890</span>
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
                <span>info@venus.com</span>
              </a>
            </div>
            <div className="flex items-center gap-3 xl:gap-4">
              <span className="text-[#111111]/70 text-xs sm:text-sm text-center sm:text-left">
                Free Shipping on Orders Over $50
              </span>
              <div className="flex gap-2">
                {["facebook", "instagram", "twitter"].map((social) => (
                  <a
                    key={social}
                    href={`#${social}`}
                    className="w-6 h-6 xl:w-7 xl:h-7 rounded-full bg-[#CBE600] hover:bg-[#111111] text-[#111111] hover:text-[#DFF200] flex items-center justify-center transition-all duration-300 text-xs font-bold"
                    aria-label={social}
                  >
                    {social[0].toUpperCase()}
                  </a>
                ))}
              </div>
            </div>
          </div> */}

          {/* Main Header */}
          <div className="flex items-center justify-between h-16 md:h-20 lg:h-24">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
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
            <nav className="hidden lg:flex flex-1 justify-center px-8 relative">
              <ul className="flex items-center gap-1 font-semibold uppercase tracking-wider text-sm lg:text-base">
                {navigation.map((nav) => {
                  const isMega =
                    Array.isArray(nav.categories) && nav.categories.length > 0;
                  const isOpen = openMenu === nav.id;

                  return (
                    <li
                      key={nav.id}
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
                        <div
                          className={`absolute left-[540px] w-[1250px] transform -translate-x-1/2 mt-6 bg-[#FFFDF6] text-[#111111] border-[#CBE600] border-1 rounded-lg shadow-2xl transition-all duration-300 pointer-events-auto ${
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
                              <div className="col-span-9 grid grid-cols-4 gap-4">
                                {nav.categories?.map((cat) => (
                                  <div key={cat.id} className="space-y-1">
                                    <h4 className="text-base font-bold tracking-wide text-[#CBE600] mb-[2px] pb-[2px] border-b-2 border-[#CBE600]">
                                      {cat.title}
                                    </h4>
                                    <ul className="space-y-1">
                                      {cat.subHeadings?.map((item) => (
                                        <li key={item.id}>
                                          <Link
                                            to={item.path || item.href || "#"}
                                            className="block text-[#666] hover:text-[#CBE600] transition-colors text-sm leading-relaxed"
                                          >
                                            {item.name}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>

                              <div className="col-span-3 flex items-center justify-center">
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
            <div className="flex items-center gap-1 mg:gap-2">
              <button aria-label="Search" className={iconButtonClass}>
                <SearchIcon className="w-5 h-5 md:w-6 md:h-6" />
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#111111] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden lg:block">
                  Search
                </span>
              </button>

              {/* Account / Avatar */}
              <div className="relative" ref={profileRef}>
                <button
                  aria-label="Account"
                  aria-haspopup="true"
                  aria-expanded={profileOpen}
                  className={`${iconButtonClass} ${loggedIn ? "px-1" : ""}`}
                  onClick={() => {
                    if (!loggedIn) {
                      handleOpenAuth();
                      return;
                    }
                    setProfileOpen((p) => !p);
                  }}
                >
                  {loggedIn && firstChar ? (
                    <div className="w-8 h-8 bg-[#CBE600] text-[#111111] font-bold rounded-full flex items-center justify-center text-sm shadow-md select-none">
                      {firstChar}
                    </div>
                  ) : (
                    <>
                      <UserIcon className="w-5 h-5 md:w-6 md:h-6" />
                      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[#111111] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        Account
                      </span>
                    </>
                  )}
                </button>

                {/* Profile dropdown */}
                {loggedIn && (
                  <div
                    className={`absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-white border z-50 transition-transform origin-top-right ${
                      profileOpen
                        ? "scale-100 opacity-100"
                        : "scale-95 opacity-0 pointer-events-none"
                    }`}
                    role="menu"
                    aria-hidden={!profileOpen}
                  >
                    <div className="p-2">
                      <div className="px-3 py-2 text-sm text-gray-700 font-medium">
                        Hello, {displayName}
                      </div>
                      <div className="border-t my-1" />

                      {/* My Orders */}
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          navigate("/account/order");
                        }}
                        className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm"
                      >
                        My Orders
                      </button>

                      {/* Profile */}
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          navigate("/profile");
                        }}
                        className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm"
                      >
                        Profile
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm text-red-600 font-medium"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Button */}
              <div className="ml-4 flow-root lg:ml-6">
                <Button
                  onClick={() => navigate("/cart")}
                  className="group -m-2 flex items-center p-2"
                >
                  <ShoppingBagIcon className="h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                  <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                    {cart?.cart?.totalItem || 0}
                  </span>
                  <span className="sr-only">items in cart</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] z-50 lg:hidden transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto bg-white">
          {/* Mobile Menu Header */}
          <div className="bg-[#DFF200] p-4 md:p-6 flex items-center justify-between">
            <img src="logo/logo.jpeg" alt="Logo" className="h-10 rounded-full" />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className="p-4 bg-white">
            <ul className="space-y-[1px]">
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
                          className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-[#DFF200]/40 transition-colors font-semibold uppercase text-sm"
                        >
                          <span>{nav.title}</span>
                          <Chevron open={isOpen} />
                        </button>

                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            isOpen ? "max-h-[2000px] mt-2" : "max-h-0"
                          }`}
                        >
                          <div className="pl-2 pr-2 space-y-3">
                            {nav.categories?.map((cat) => (
                              <div key={cat.id}>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-[#CBE600] mb-2">
                                  {cat.title}
                                </h4>
                                <ul className="space-y-1">
                                  {cat.subHeadings?.map((item) => (
                                    <li key={item.id}>
                                      <Link
                                        to={item.path || item.href || "#"}
                                        onClick={() => {
                                          setMobileMenuOpen(false);
                                          setOpenMenu(null);
                                        }}
                                        className="block px-3 py-2 rounded-lg hover:bg-[#DFF200]/40 transition-colors text-sm font-medium"
                                      >
                                        {item.name}
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
                        className="block px-4 py-3 rounded-lg hover:bg-[#DFF200]/40 transition-colors font-semibold uppercase text-sm"
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
          <div className="p-6 bg-[#FFFDF6]">
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

      {/* Auth Modal */}
      <AuthModal handleClose={handleCloseAuth} open={openAuthModal} />
    </>
  );
}
