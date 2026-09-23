import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// When a token is rejected (invalid/expired) or the user is missing,
// clear the stale session and send the user to the sign-in page.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isAuthError = status === 401;
    const message = error.response?.data?.message || "";

    if (
      isAuthError &&
      !message.toLowerCase().includes("password") &&
      !message.toLowerCase().includes("account")
    ) {
      // Sign-in failures are handled by the login form itself;
      // any other 401 means the token is bad — force a logout.
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("authChanged"));

      if (window.location.pathname !== "/sign-in") {
        window.location.replace("/sign-in");
      }
    }

    return Promise.reject(error);
  },
);

export default api;
