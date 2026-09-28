import React from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const DashboardHeader = ({ user }) => {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back
          {user?.name ? `, ${user?.name.split(" ")[0]}` : ""} 👋
        </h1>
        <p className="mt-2 text-gray-600">
          Here's an overview of your projects and tasks.
        </p>
      </div>

      <Link
        to="/create-project"
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
      >
        <Plus size={17} />
        Create Project
      </Link>
    </div>
  );
};

export default DashboardHeader;
