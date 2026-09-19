import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem("token")),
  );
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleAuthChange = () => {
      const token = localStorage.getItem("token");

      setLoggedIn(Boolean(token));
    };

    window.addEventListener("authChanged", handleAuthChange);

    return () => window.removeEventListener("authChanged", handleAuthChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");

    window.dispatchEvent(
      new CustomEvent("authChanged", {
        detail: { user: null },
      }),
    );

    setLoggedIn(false);
    setMenuOpen(false);

    navigate("/sign-in");
  };

  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-gray-900"
        >
          Dev<span className="text-blue-600">Board</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-3 md:flex">
          {!loggedIn ? (
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
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              <LogOut size={18} />
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen((s) => !s)}
          className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-gray-200 px-6 py-4 md:hidden">
          {!loggedIn ? (
            <div className="flex flex-col gap-2">
              <NavLink
                to="/sign-in"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-4 py-2 font-medium text-gray-700 hover:bg-gray-100"
              >
                Login
              </NavLink>

              <NavLink
                to="/sign-up"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
              >
                Register
              </NavLink>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-4 py-2 font-medium text-gray-700 hover:bg-gray-100"
            >
              <LogOut size={18} />
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
