import React from "react";
import { Link, useNavigate } from "react-router-dom";

// --- REVISED: Footer uses Header's color scheme: BG #DFF200, Text #111111 ---

const Icon = ({ children, ...props }) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    {children}
  </svg>
);

export default function Footer() {

  const navigate = useNavigate()
  return (
    // CHANGE 1: Use Header's background and dark text color
    <footer className="bg-[#DFF200] text-[#111111]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand + social */}
          <div className="md:col-span-3">
            {/* CHANGE 2: Brand text is now main text color (could be lighter if you prefer) */}
            <h3 className="text-[#111111] font-bold text-lg mb-3">
              VENUS GARMENTS
            </h3>
            {/* CHANGE 3: Changed descriptive text color to a soft dark gray */}
            <p className="text-sm text-gray-700 mb-5">
              Classic & contemporary apparel — crafted with care. Follow us for
              drops & offers.
            </p>

            <div className="flex items-center gap-3">
              {/* Facebook */}
              <a
                aria-label="Facebook"
                href="https://m.facebook.com/venus2009garments/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-md border border-[#CBE600] hover:bg-[#CBE600] transition-colors"
              >
                <Icon className="w-5 h-5 text-[#111111]">
                  <path d="M18 2h-3a4 4 0 00-4 4v3H8v3h3v6h3v-6h2.3l.7-3H14V6a1 1 0 011-1h3V2z" />
                </Icon>
              </a>

              {/* Instagram */}
              <a
                aria-label="Instagram"
                href="https://www.instagram.com/venusgarments.in?igsh=Mm9zd2tiMG85Z2xk"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-md border border-[#CBE600] hover:bg-[#CBE600] transition-colors"
              >
                <Icon className="w-5 h-5 text-[#111111]">
                  <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
                  <path d="M16 11.37a4 4 0 11-4.94-4.94 4 4 0 014.94 4.94z" />
                  <path d="M17.5 6.5h.01" />
                </Icon>
              </a>

              {/* YouTube */}
              <a
                aria-label="YouTube"
                href="https://m.youtube.com/@Venusgarments?fbclid=PAT01DUAOX2vtleHRuA2FlbQIxMABzcnRjBmFwcF9pZA81NjcwNjczNDMzNTI0MjcAAaf2IyP_e8vwpQt_rvEiHF78af2RhK2n5WGpOiE-Ab3hDQF5D0VWQ6gJZ6KQ-A_aem_wH6wxTc83xrYgwNN-kYCLQ"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-md border border-[#CBE600] hover:bg-[#CBE600] transition-colors"
              >
                <Icon className="w-6 h-6 text-[#111111]">
                  <path d="M10 15l5.19-3L10 9v6z" />
                  <path d="M21.8 8.001a2.74 2.74 0 0 0-1.93-1.94C17.91 5.5 12 5.5 12 5.5s-5.91 0-7.87.56A2.74 2.74 0 0 0 2.2 8.001 28.63 28.63 0 0 0 1.5 12a28.63 28.63 0 0 0 .7 3.999 2.74 2.74 0 0 0 1.93 1.94C6.09 18.5 12 18.5 12 18.5s5.91 0 7.87-.56a2.74 2.74 0 0 0 1.93-1.94A28.63 28.63 0 0 0 22.5 12a28.63 28.63 0 0 0-.7-3.999z" />
                </Icon>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="md:col-span-3">
            <h4 className="text-[#111111] font-semibold mb-3">SHOP</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              {/* CHANGE 5: Navigation link hover now uses the header's link hover BG color */}
              <li>
                <Link
                  to="/products"
                  className="py-1 px-2 -mx-2 rounded hover:bg-[#CBE600] transition-colors inline-block"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/overview"
                  className="py-1 px-2 -mx-2 rounded hover:bg-[#CBE600] transition-colors inline-block"
                >
                  Overview
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="py-1 px-2 -mx-2 rounded hover:bg-[#CBE600] transition-colors inline-block"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/releases"
                  className="py-1 px-2 -mx-2 rounded hover:bg-[#CBE600] transition-colors inline-block"
                >
                  Releases
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-3">
            <h4 className="text-[#111111] font-semibold mb-3">COMPANY</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              {/* Matches Change 5 */}
              <li>
                <Link
                  to="/about-us"
                  className="py-1 px-2 -mx-2 rounded hover:bg-[#CBE600] transition-colors inline-block"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact-us"
                  className="py-1 px-2 -mx-2 rounded hover:bg-[#CBE600] transition-colors inline-block"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/news"
                  className="py-1 px-2 -mx-2 rounded hover:bg-[#CBE600] transition-colors inline-block"
                >
                  News
                </Link>
              </li>
              <li>
                <Link
                  to="/support"
                  className="py-1 px-2 -mx-2 rounded hover:bg-[#CBE600] transition-colors inline-block"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Subscribe */}
          <div className="md:col-span-3">
            <h4 className="text-[#111111] font-semibold mb-3">
              STAY UP TO DATE
            </h4>
            <p className="text-sm text-gray-700 mb-4">
              Enter your email for exclusive offers and new arrivals.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const email = e.currentTarget.email?.value;
                if (!email) return;
                // TODO: wire to API
                console.log("subscribe:", email);
                e.currentTarget.reset();
                // small unobtrusive feedback
                alert("Thanks — you'll be notified!");
              }}
              className="flex gap-2"
            >
              <button
                onClick={() => navigate("/contact-us")}
                type="submit"
                // CHANGE 6: Submit button needs a contrasting color now, using the secondary hover color
                className="px-4 py-2 rounded bg-[#CBE600] text-[#111111] font-semibold hover:opacity-95 transition"
              >
                Contact-Us
              </button>
            </form>
          </div>
        </div>

        {/* Divider + bottom row */}
        {/* CHANGE 7: Adjusted divider color for better contrast on the light background */}
        <div className="border-t border-[#CBE600] mt-8 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* CHANGE 8: Copyright text color updated */}
            <p className="text-sm text-gray-700">
              © {new Date().getFullYear()} Venus Garments. All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              {/* Matches Change 5 - bottom links use hover background */}
              <Link
                to="/terms-condition"
                className="py-1 px-2 -mx-2 rounded text-sm text-[#111111] hover:bg-[#CBE600] transition inline-block"
              >
                Terms
              </Link>
              <Link
                to="/privaciy-policy"
                className="py-1 px-2 -mx-2 rounded text-sm text-[#111111] hover:bg-[#CBE600] transition inline-block"
              >
                Privacy
              </Link>
              <Link
                to="/cookies"
                className="py-1 px-2 -mx-2 rounded text-sm text-[#111111] hover:bg-[#CBE600] transition inline-block"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}