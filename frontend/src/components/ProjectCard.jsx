import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Trash2 } from "lucide-react";

const ProjectCard = ({ project, stats, onDelete }) => {
  const projectStats = stats || {
    total: 0,
    completed: 0,
  };

  const projectProgress =
    projectStats.total > 0
      ? Math.round((projectStats.completed / projectStats.total) * 100)
      : 0;

  return (
    <div className="flex flex-col rounded-lg border border-gray-200 p-4 transition hover:border-gray-300 hover:shadow-sm">
      <Link
        to={`/projects/${project._id}`}
        className="block flex-1"
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900">
            {project.name}
          </h3>

          <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
            {projectProgress}%
          </span>
        </div>

        <p className="mt-1 line-clamp-2 text-sm text-gray-600">
          {project.details}
        </p>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-gray-900 transition-all duration-300"
            style={{
              width: `${projectProgress}%`,
            }}
          />
        </div>

        <p className="mt-2 text-xs text-gray-500">
          {projectStats.completed} / {projectStats.total} tasks completed
        </p>
      </Link>

      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <Link
          to={`/projects/${project._id}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View Project
          <ArrowRight size={14} />
        </Link>

        <button
          onClick={() => onDelete(project)}
          className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
          aria-label={`Delete project ${project.name}`}
          title="Delete project"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;