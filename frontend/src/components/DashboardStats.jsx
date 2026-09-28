import React from "react";

const DashboardStats = ({ stats }) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50">
              {stat.icon}
            </div>

            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>

          <h2 className="mt-3 text-3xl font-bold text-gray-900">
            {stat.value}
          </h2>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
