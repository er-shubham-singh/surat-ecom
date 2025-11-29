import { useLocation } from "react-router-dom";
import { TbError404 } from "react-icons/tb"; // Optional: Install with `npm i react-icons`

export default function NotFound() {
  const location = useLocation();

  console.log("not found ---- path", location.pathname);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 py-12 text-center">
      <div className="animate-fadeInUp space-y-6">
        {/* Icon */}
        <div className="text-pink-600 text-6xl flex justify-center">
          <TbError404 />
        </div>

        {/* Text */}
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          Oops! Page Not Found
        </h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for.
          <br />
          It might have been moved or deleted.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <a
            href="/"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-semibold transition"
          >
            Go to Homepage
          </a>
          <a
            href="/contact"
            className="text-indigo-600 hover:underline font-medium"
          >
            Contact Support &rarr;
          </a>
        </div>
      </div>
    </main>
  );
}
