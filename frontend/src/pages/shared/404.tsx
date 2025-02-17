import { FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-100 to-white text-center px-4">
        <FaExclamationTriangle className="text-blue-600 text-9xl mb-4" />
        <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="bg-blue-600 text-white py-3 px-8 rounded-full hover:bg-blue-700 transition"
        >
          Go Home
        </Link>
    </section>
  );
};

export default NotFoundPage;
