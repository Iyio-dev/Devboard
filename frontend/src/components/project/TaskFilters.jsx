import React from "react";
import { Search } from "lucide-react";

const TaskFilters = ({
  FILTERS,
  uiState,
  setUiState,
}) => {
  const handleFilterChange = (filter) => {
    setUiState((prev) => ({
      ...prev,
      taskFilter: filter,
    }));
  };

  const handleSearchChange = (e) => {
    setUiState((prev) => ({
      ...prev,
      taskSearch: e.target.value,
    }));
  };

  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => handleFilterChange(filter)}
              className={`px-4 py-2 rounded-lg text-sm transition ${
                uiState.taskFilter === filter
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={uiState.taskSearch}
            onChange={handleSearchChange}
            placeholder="Search tasks..."
            aria-label="Search tasks"
            className="w-full md:w-64 pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-black"
          />
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;