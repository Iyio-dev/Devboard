import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const NotFound = () => {
  return (
    <>
      <Navbar />

      <section className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>

          <p className="mt-3 text-gray-600">
            Sorry, we couldn't find the page you're looking for.
          </p>

          <Link
            to="/"
            className="mt-6 inline-block rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </>
  );
};

export default NotFound;
