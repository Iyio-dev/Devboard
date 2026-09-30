import { useEffect, useState } from "react";
import { Activity, ChevronLeft, ChevronRight } from "lucide-react";

import Navbar from "../Navbar";
import ActivityItem from "./ActivityItem.jsx";
import api from "../../services/api";

const ActivityHistory = () => {
  const [dataState, setDataState] = useState({
    activities: [],
    pagination: null,
  });

  const [uiState, setUiState] = useState({
    page: 1,
    limit: 10,
  });

  const [status, setStatus] = useState({
    loading: true,
    error: null,
  });

  const fetchData = async () => {
    try {
      setStatus({
        loading: true,
        error: null,
      });

      const response = await api.get("/activities/", {
        params: {
          page: uiState.page,
          limit: uiState.limit,
        },
      });

      setDataState({
        activities: response.data.message || [],
        pagination: response.data.pagination || null,
      });

      setStatus({
        loading: false,
        error: null,
      });
    } catch (error) {
      setStatus({
        loading: false,
        error:
          error.response?.data?.message ||
          "Failed to load activity history.",
      });

      setDataState({
        activities: [],
        pagination: null,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [uiState.page]);

  const handlePreviousPage = () => {
    if (!dataState.pagination?.hasPrevPage) return;

    setUiState((prev) => ({
      ...prev,
      page: prev.page - 1,
    }));
  };

  const handleNextPage = () => {
    if (!dataState.pagination?.hasNextPage) return;

    setUiState((prev) => ({
      ...prev,
      page: prev.page + 1,
    }));
  };

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
              <Activity size={20} />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Activity History
              </h1>

              <p className="text-sm text-gray-500">
                Track your project and task activity.
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {status.error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {status.error}
          </div>
        )}

        {/* Activity list */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          {status.loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <p className="text-sm text-gray-500">
                Loading activity...
              </p>
            </div>
          ) : dataState.activities.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {dataState.activities.map((activity) => (
                <div key={activity._id} className="px-5 py-4">
                  <ActivityItem activity={activity} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Activity size={22} className="text-gray-500" />
              </div>

              <h2 className="font-medium text-gray-900">
                No activity yet
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your project and task activity will appear here.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!status.loading && dataState.pagination && (
          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePreviousPage}
              disabled={!dataState.pagination.hasPrevPage}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <span className="text-sm text-gray-500">
              Page {dataState.pagination.page} of{" "}
              {dataState.pagination.totalPages}
            </span>

            <button
              type="button"
              onClick={handleNextPage}
              disabled={!dataState.pagination.hasNextPage}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </main>
    </>
  );
};

export default ActivityHistory;