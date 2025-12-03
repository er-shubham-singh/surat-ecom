import React from "react";
import {
  MdGavel,
  MdLocalShipping,
  MdAssignmentReturn,
  MdPayment,
  MdInfo,
} from "react-icons/md";

const TearmsCondition = () => {
  return (
    <div
      className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16"
      style={{ backgroundColor: "#FFF9E8" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex justify-center mb-4">
            <MdGavel
              className="text-5xl sm:text-6xl md:text-7xl"
              style={{ color: "#CBE600" }}
            />
          </div>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4"
            style={{ color: "#111111" }}
          >
            Terms & Conditions
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
              Welcome to <strong>Venus Garments</strong>! By accessing or using
              our website, you agree to be bound by the following terms and
              conditions. Please read them carefully before making a purchase.
            </p>
          </div>

          {/* Use of Website */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3">
              <MdInfo
                className="text-2xl sm:text-3xl flex-shrink-0"
                style={{ color: "#CBE600" }}
              />
              <h2
                className="text-xl sm:text-2xl lg:text-3xl font-bold"
                style={{ color: "#111111" }}
              >
                1. Use of Website
              </h2>
            </div>
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed ml-0 sm:ml-11">
              Our website is intended for personal and non-commercial use. Any
              misuse, including fraudulent activities, unauthorized access, or
              violation of intellectual property rights, will result in
              termination of your account and possible legal action.
            </p>
          </div>

          {/* Orders & Payments */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3">
              <MdPayment
                className="text-2xl sm:text-3xl flex-shrink-0"
                style={{ color: "#CBE600" }}
              />
              <h2
                className="text-xl sm:text-2xl lg:text-3xl font-bold"
                style={{ color: "#111111" }}
              >
                2. Orders & Payments
              </h2>
            </div>
            <div className="space-y-2 sm:space-y-3 ml-0 sm:ml-11">
              <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                All purchases made on Venus Garments are subject to availability
                and confirmation of the order price. We reserve the right to
                cancel or refuse any order for any reason.
              </p>
              <ul className="list-disc ml-6 space-y-1 sm:space-y-2 text-sm sm:text-base lg:text-lg text-gray-700">
                <li>Prices are subject to change without prior notice</li>
                <li>Payment must be completed before order processing</li>
                <li>We accept all major payment methods and UPI</li>
                <li>
                  All transactions are processed securely through encrypted
                  gateways
                </li>
              </ul>
            </div>
          </div>

          {/* Shipping */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3">
              <MdLocalShipping
                className="text-2xl sm:text-3xl flex-shrink-0"
                style={{ color: "#CBE600" }}
              />
              <h2
                className="text-xl sm:text-2xl lg:text-3xl font-bold"
                style={{ color: "#111111" }}
              >
                3. Shipping & Delivery
              </h2>
            </div>
            <div className="space-y-2 sm:space-y-3 ml-0 sm:ml-11">
              <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                We aim to process and dispatch your order as quickly as
                possible.
              </p>
              <div
                className="p-4 rounded-lg"
                style={{ backgroundColor: "#FFF9E8" }}
              >
                <p
                  className="text-sm sm:text-base lg:text-lg font-semibold mb-2"
                  style={{ color: "#111111" }}
                >
                  Delivery Timeline:
                </p>
                <ul className="list-disc ml-6 space-y-1 text-sm sm:text-base text-gray-700">
                  <li>
                    Minimum: <strong>2-3 business days</strong>
                  </li>
                  <li>
                    Maximum: <strong>7-10 business days</strong>
                  </li>
                  <li>Remote areas may take additional 2-3 days</li>
                </ul>
              </div>
              <p className="text-sm sm:text-base text-gray-600 italic">
                *Delivery times may vary based on location and external factors
                like weather or holidays.
              </p>
            </div>
          </div>

          {/* Returns */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3">
              <MdAssignmentReturn
                className="text-2xl sm:text-3xl flex-shrink-0"
                style={{ color: "#CBE600" }}
              />
              <h2
                className="text-xl sm:text-2xl lg:text-3xl font-bold"
                style={{ color: "#111111" }}
              >
                4. Returns & Exchange
              </h2>
            </div>
            <div className="space-y-2 sm:space-y-3 ml-0 sm:ml-11">
              <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                Returns are accepted within <strong>7 days</strong> of delivery.
                The product must be:
              </p>
              <ul className="list-disc ml-6 space-y-1 sm:space-y-2 text-sm sm:text-base lg:text-lg text-gray-700">
                <li>Unused and in its original condition</li>
                <li>In original packaging with all tags attached</li>
                <li>Accompanied by the original receipt or invoice</li>
              </ul>
              <p className="text-sm sm:text-base text-gray-600 italic mt-2">
                *Return shipping costs may apply. Damaged or defective items
                will be replaced free of charge.
              </p>
            </div>
          </div>

          {/* Refund & Cancellation */}
          <div className="space-y-3 sm:space-y-4">
            <h2
              className="text-xl sm:text-2xl lg:text-3xl font-bold"
              style={{ color: "#111111" }}
            >
              5. Refund & Cancellation Policy
            </h2>
            <div className="space-y-2 sm:space-y-3">
              <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                <strong>Cancellation:</strong> Orders can be cancelled within 24
                hours of placement. After dispatch, cancellations are subject to
                return conditions.
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                <strong>Refunds:</strong> Approved refunds are processed within{" "}
                <strong>7-10 business days</strong>. The refund will be credited
                to the original payment method. Processing time may vary
                depending on your bank or payment provider.
              </p>
            </div>
          </div>

          {/* Intellectual Property */}
          <div className="space-y-3 sm:space-y-4">
            <h2
              className="text-xl sm:text-2xl lg:text-3xl font-bold"
              style={{ color: "#111111" }}
            >
              6. Intellectual Property
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
              All content on Venus Garments, including but not limited to
              images, logos, designs, text, and graphics, is the exclusive
              property of Venus Garments and cannot be used, reproduced, or
              distributed without written permission.
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
              Questions About Terms?
            </h3>
            <p className="text-sm sm:text-base text-gray-700">
              If you have any questions regarding our terms and conditions,
              please reach out to us at{" "}
              <a
                href="mailto:venusgarments@gmail.com"
                className="font-semibold hover:underline"
                style={{ color: "#CBE600" }}
              >
                venusgarments@gmail.com
              </a>{" "}
              or call <strong>+91 98925 50941</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TearmsCondition;