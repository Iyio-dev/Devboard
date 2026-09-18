import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../services/api.js";
import { X } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const login = await api.post("/auth/sign-in", {
        email: email,
        password: password,
      });

      localStorage.setItem("token", login.data.token);
      navigate("/dashboard");

      window.dispatchEvent(new Event("authChanged"));
    } catch (error) {
      setError(
        error.response?.data?.message || "An error occurred during login.",
      );
      setLoading(false);
      console.log("Status:", error.response?.status);
      console.log("Message:", error.response?.data);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">
          Welcome Back
        </h2>

        {error && (
          <div className="flex justify-center align-middle mb-4 rounded-lg bg-red-100 p-4">
            <X className="mr-2 h-5 w-5 text-red-700" onClick={() => setError(false)}/>
            <div className="text-sm text-red-700">
            {error}
          </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          {loading ? (
            <>
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-400 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700"
              >
                Logging in...
              </button>
            </>
          ) : (
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700"
            >
              Login
            </button>
          )}
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/sign-up"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
