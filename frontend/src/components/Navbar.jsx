import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Menu, X, LayoutDashboard, Plus, UserRound } from "lucide-react";
import { getToken, getStoredUser, clearSession } from "../services/auth.js";
import { useToast } from "../toastContext.js";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [loggedIn, setLoggedIn] = useState(Boolean(getToken()));
  const [user, setUser] = useState(getStoredUser());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleAuthChange = () => {
      setLoggedIn(Boolean(getToken()));
      setUser(getStoredUser());
    };

    window.addEventListener("authChanged", handleAuthChange);

    return () => window.removeEventListener("authChanged", handleAuthChange);
  }, []);

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    clearSession();
    setLoggedIn(false);
    setMenuOpen(false);
    toast.success("You have been logged out.");
    navigate("/sign-in");
  };

  // Links only shown while logged in
  const appLinks = [
    { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
    { to: "/create-project", label: "New Project", icon: <Plus size={16} /> },
    { to: "/profile", label: "Profile", icon: <UserRound size={16} /> },
  ];

  const desktopAuthArea = !loggedIn ? (
    <>
      <NavLink
        to="/sign-in"
        className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
      >
        Login
      </NavLink>

      <NavLink
        to="/sign-up"
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
      >
        Register
      </NavLink>
    </>
  ) : (
    <div className="flex items-center gap-2">
      {appLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-blue-50 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          {link.icon}
          {link.label}
        </NavLink>
      ))}

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );

  const mobileAuthArea = !loggedIn ? (
    <div className="flex flex-col gap-2">
      <NavLink
        to="/sign-in"
        className="rounded-lg px-4 py-2 font-medium text-gray-700 hover:bg-gray-100"
      >
        Login
      </NavLink>

      <NavLink
        to="/sign-up"
        className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
      >
        Register
      </NavLink>
    </div>
  ) : (
    <div className="flex flex-col gap-1">
      {user && (
        <p className="px-4 pb-2 text-sm text-gray-500">
          Signed in as <span className="font-medium text-gray-900">{user.name}</span>
        </p>
      )}

      {appLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition ${
              isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          {link.icon}
          {link.label}
        </NavLink>
      ))}

      <button
        onClick={handleLogout}
        className="flex w-full items-center gap-2 rounded-lg px-4 py-2 font-medium text-gray-700 hover:bg-gray-100"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );

  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-gray-900"
        >
          Dev<span className="text-blue-600">Board</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-2 md:flex">{desktopAuthArea}</div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen((s) => !s)}
          className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-gray-200 px-4 py-4 sm:px-6 md:hidden">
          {mobileAuthArea}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
