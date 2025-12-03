import React from "react";
import {
  MdSecurity,
  MdLock,
  MdVerifiedUser,
  MdPrivacyTip,
} from "react-icons/md";

const PrivacyPolicy = () => {
  return (
    <div
      className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16"
      style={{ backgroundColor: "#FFF9E8" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex justify-center mb-4">
            <MdSecurity
              className="text-5xl sm:text-6xl md:text-7xl"
              style={{ color: "#CBE600" }}
            />
          </div>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4"
            style={{ color: "#111111" }}
          >
            Privacy Policy
          </h1>
          <p
            className="text-base sm:text-lg md:text-xl font-semibold"
            style={{ color: "#CBE600" }}
          >
            Venus Garments
          </p>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Last updated: January 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10 space-y-6 sm:space-y-8">
          {/* Introduction */}
          <div className="space-y-3 sm:space-y-4">
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
              At <strong>Venus Garments</strong>, your privacy is of utmost
              importance to us. We are committed to protecting the personal
              information of our customers and visitors. This privacy policy
              outlines how we collect, use, and safeguard your data.
            </p>
          </div>

          {/* What We Collect */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3">
              <MdPrivacyTip
                className="text-2xl sm:text-3xl flex-shrink-0"
                style={{ color: "#CBE600" }}
              />
              <h2
                className="text-xl sm:text-2xl lg:text-3xl font-bold"
                style={{ color: "#111111" }}
              >
                What We Collect
              </h2>
            </div>
            <ul className="list-disc ml-6 sm:ml-8 space-y-2 text-sm sm:text-base lg:text-lg text-gray-700">
              <li>Name, phone number, and shipping address</li>
              <li>Email address for order confirmations and updates</li>
              <li>
                Payment details (processed securely through trusted payment
                gateways)
              </li>
              <li>Browsing behavior and interaction on our website</li>
              <li>Device information and IP address</li>
            </ul>
          </div>

          {/* How We Use Your Information */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3">
              <MdVerifiedUser
                className="text-2xl sm:text-3xl flex-shrink-0"
                style={{ color: "# CBE600" }}
              />
              <h2
                className="text-xl sm:text-2xl lg:text-3xl font-bold"
                style={{ color: "#111111" }}
              >
                How We Use Your Information
              </h2>
            </div>
            <ul className="list-disc ml-6 sm:ml-8 space-y-2 text-sm sm:text-base lg:text-lg text-gray-700">
              <li>To process and fulfill your orders efficiently</li>
              <li>To provide customer support and respond to inquiries</li>
              <li>To improve your shopping experience on Venus Garments</li>
              <li>
                To send order updates, shipping notifications, and promotional
                offers
              </li>
              <li>To analyze website usage and enhance our services</li>
            </ul>
          </div>

          {/* Data Security */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3">
              <MdLock
                className="text-2xl sm:text-3xl flex-shrink-0"
                style={{ color: "#CBE600" }}
              />
              <h2
                className="text-xl sm:text-2xl lg:text-3xl font-bold"
                style={{ color: "#111111" }}
              >
                Data Security
              </h2>
            </div>
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
              We implement industry-standard security measures to protect your
              personal information from unauthorized access, disclosure, or
              alteration. All payment transactions are encrypted using SSL
              technology to ensure your financial data remains secure.
            </p>
          </div>

          {/* Your Rights & Consent */}
          <div className="space-y-3 sm:space-y-4">
            <h2
              className="text-xl sm:text-2xl lg:text-3xl font-bold"
              style={{ color: "#111111" }}
            >
              Your Rights & Consent
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
              By using Venus Garments, you consent to our privacy policy. You
              have full control over your personal data and can:
            </p>
            <ul className="list-disc ml-6 sm:ml-8 space-y-2 text-sm sm:text-base lg:text-lg text-gray-700">
              <li>Request access to your personal information</li>
              <li>Update or correct your data at any time</li>
              <li>Request deletion of your account and data</li>
              <li>Opt-out of promotional communications</li>
            </ul>
          </div>

          {/* Third-Party Sharing */}
          <div className="space-y-3 sm:space-y-4">
            <h2
              className="text-xl sm:text-2xl lg:text-3xl font-bold"
              style={{ color: "#111111" }}
            >
              Third-Party Sharing
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
              We do not sell or rent your personal information to third parties.
              We may share data with trusted service providers (shipping
              partners, payment processors) solely for order fulfillment
              purposes.
            </p>
          </div>

          {/* Contact */}
          <div
            className="mt-8 sm:mt-10 p-4 sm:p-6 rounded-lg"
            style={{ backgroundColor: "#FFF9E8" }}
          >
            <h3
              className="text-lg sm:text-xl font-bold mb-2 sm:mb-3"
              style={{ color: "#111111" }}
            >
              Questions About Privacy?
            </h3>
            <p className="text-sm sm:text-base text-gray-700">
              If you have any concerns regarding our privacy practices, please
              contact us at{" "}
              <a
                href="mailto:venusgarments@gmail.com"
                className="font-semibold hover:underline"
                style={{ color: "#CBE600" }}
              >
                venusgarments@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;