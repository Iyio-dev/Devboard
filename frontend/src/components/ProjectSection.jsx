import React from "react";
import { Link } from "react-router";
import { Search, FolderKanban, Plus, ArrowRight, Trash2 } from "lucide-react";
import ProjectCard from "./ProjectCard";

const ProjectSection = ({
  projects,
  filteredProjects,
  search,
  onSearchChange,
  statsByProject,
  onDelete,
}) => {
  return (
    <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Your Projects</h2>

        {projects.length > 0 && (
          <div className="relative sm:w-64">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search projects..."
              aria-label="Search projects"
              className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-gray-900"
            />
          </div>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <FolderKanban size={21} className="text-gray-500" />
          </div>

          <h3 className="mt-4 font-semibold text-gray-900">
            You don't have any projects yet
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Create your first project to start tracking tasks and progress.
          </p>

          <Link
            to="/create-project"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            <Plus size={16} />
            Create Project
          </Link>
        </div>
      ) : filteredProjects.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-500">
          No projects match "{search}".
        </p>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => {
            const projectStats = statsByProject[project._id] || {
                total: 0,
                completed: 0,
              };
            
              const projectProgress =
                projectStats.total > 0
                  ? Math.round((projectStats.completed / projectStats.total) * 100)
                  : 0;

            return (
              <ProjectCard
                key={project._id}
                project={project}
                stats={projectStats}
                projectProgress={projectProgress}
                onDelete={onDelete}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProjectSection;
