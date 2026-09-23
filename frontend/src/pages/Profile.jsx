import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { getStoredUser, fetchUserProfile } from "../services/auth.js";
import { UserRound, Mail, CalendarDays } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(!user);

  // Prefer fresh data from the backend; fall back to the cached copy
  // in localStorage while the request is in flight.
  useEffect(() => {
    let cancelled = false;

    const loadUser = async () => {
      try {
        const profile = await fetchUserProfile();
        if (!cancelled) {
          setUser(profile);
          localStorage.setItem("user", JSON.stringify(profile));
        }
      } catch {
        // Keep the cached user; the API interceptor handles bad tokens.
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "—";

    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Profile
          </h1>

          <p className="mt-2 text-gray-600">
            Your account information.
          </p>

          {loading ? (
            <div className="mt-8 h-40 animate-pulse rounded-2xl bg-white shadow-sm" />
          ) : user ? (
            <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">
              {/* Avatar header */}
              <div className="flex items-center gap-4 border-b border-gray-100 p-6 sm:p-8">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
                  {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-xl font-bold text-gray-900">
                    {user.name}
                  </h2>

                  <p className="text-sm text-gray-500">DevBoard member</p>
                </div>
              </div>

              {/* Details */}
              <dl className="divide-y divide-gray-100">
                <div className="flex items-center gap-4 p-5 sm:p-6">
                  <UserRound size={18} className="shrink-0 text-gray-400" />

                  <div className="min-w-0">
                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Name
                    </dt>

                    <dd className="mt-0.5 truncate text-sm font-medium text-gray-900">
                      {user.name}
                    </dd>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-5 sm:p-6">
                  <Mail size={18} className="shrink-0 text-gray-400" />

                  <div className="min-w-0">
                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Email
                    </dt>

                    <dd className="mt-0.5 truncate text-sm font-medium text-gray-900">
                      {user.email}
                    </dd>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-5 sm:p-6">
                  <CalendarDays size={18} className="shrink-0 text-gray-400" />

                  <div className="min-w-0">
                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Member since
                    </dt>

                    <dd className="mt-0.5 text-sm font-medium text-gray-900">
                      {formatDate(user.createdAt)}
                    </dd>
                  </div>
                </div>
              </dl>
            </div>
          ) : (
            <p className="mt-8 text-gray-500">
              Could not load your profile. Please log in again.
            </p>
          )}
        </div>
      </section>
    </>
  );
};

export default Profile;
