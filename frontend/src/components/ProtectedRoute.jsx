import { Navigate, useLocation } from "react-router-dom";

// Guards pages that require an authenticated user.
// Redirects to the sign-in page (preserving where the user wanted to go)
// when no token exists — e.g. after logout, token expiry, or a fresh visit.
const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  if (!localStorage.getItem("token")) {
    return <Navigate to="/sign-in" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;
