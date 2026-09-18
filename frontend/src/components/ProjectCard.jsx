import React, { useState, useEffect } from "react";

import Navbar from "./Navbar";

import api from "../services/api";

import { useParams } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  MoreHorizontal,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

const ProjectCard = () => {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/projects/${id}`);

      setProject(response.data.message);
    } catch (error) {
      console.error("Error fetching project:", error);

      setError(
        error.response?.data?.message ||
          "An error occurred while fetching the project."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />

        <section className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900"></div>
            <p className="mt-4 text-sm text-gray-500">
              Loading project...
            </p>
          </div>
        </section>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />

        <section className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <span className="text-lg font-bold text-red-600">!</span>
            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              Unable to load project
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {error}
            </p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">

          {/* Back navigation */}
          <div className="mb-6">
            <button className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900">
              <ArrowLeft size={17} />
              Back to Dashboard
            </button>
          </div>

          {/* Project Header */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

            <div className="border-b border-gray-100 p-6 sm:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">

                <div className="max-w-3xl">
                  <div className="mb-3 inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    Project
                  </div>

                  <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                    {project?.name}
                  </h1>

                  <p className="mt-3 leading-7 text-gray-600">
                    {project?.details}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50">
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>

              </div>
            </div>

            {/* Project Statistics */}
            <div className="grid border-b border-gray-100 sm:grid-cols-3">

              <div className="border-b border-gray-100 p-5 sm:border-b-0 sm:border-r">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                    <Circle size={19} className="text-gray-600" />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Tasks
                    </p>

                    <p className="mt-1 text-xl font-bold text-gray-900">
                      0
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-100 p-5 sm:border-b-0 sm:border-r">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                    <CheckCircle2 size={19} className="text-gray-600" />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Completed
                    </p>

                    <p className="mt-1 text-xl font-bold text-gray-900">
                      0
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                    <Clock3 size={19} className="text-gray-600" />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Progress
                    </p>

                    <p className="mt-1 text-xl font-bold text-gray-900">
                      0%
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Progress Bar */}
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900">
                  Project Progress
                </p>

                <p className="text-sm font-medium text-gray-500">
                  0%
                </p>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full w-0 rounded-full bg-gray-900"></div>
              </div>
            </div>

          </div>

          {/* Tasks Section */}
          <div className="mt-8 rounded-2xl bg-white shadow-sm">

            {/* Task Header */}
            <div className="flex flex-col gap-4 border-b border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Project Tasks
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Manage and track the tasks for this project.
                </p>
              </div>

              <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800">
                <Plus size={17} />
                Add Task
              </button>

            </div>

            {/* Task List */}
            <div className="divide-y divide-gray-100">

              {/* Example Task */}
              <div className="flex items-center justify-between gap-4 p-5 transition hover:bg-gray-50">

                <div className="flex min-w-0 items-center gap-4">

                  <button className="shrink-0 text-gray-400 transition hover:text-gray-900">
                    <Circle size={21} />
                  </button>

                  <div className="min-w-0">
                    <h3 className="truncate font-medium text-gray-900">
                      Build authentication system
                    </h3>

                    <p className="mt-1 truncate text-sm text-gray-500">
                      Create login and registration functionality.
                    </p>
                  </div>

                </div>

                <div className="flex shrink-0 items-center gap-3">

                  <span className="hidden rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700 sm:inline-block">
                    In Progress
                  </span>

                  <button className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-900">
                    <MoreHorizontal size={19} />
                  </button>

                </div>

              </div>

              {/* Example Completed Task */}
              <div className="flex items-center justify-between gap-4 p-5 transition hover:bg-gray-50">

                <div className="flex min-w-0 items-center gap-4">

                  <button className="shrink-0 text-gray-900">
                    <CheckCircle2 size={21} />
                  </button>

                  <div className="min-w-0">
                    <h3 className="truncate font-medium text-gray-400 line-through">
                      Set up MongoDB database
                    </h3>

                    <p className="mt-1 truncate text-sm text-gray-400">
                      Connect the application to MongoDB.
                    </p>
                  </div>

                </div>

                <div className="flex shrink-0 items-center gap-3">

                  <span className="hidden rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 sm:inline-block">
                    Completed
                  </span>

                  <button className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-900">
                    <MoreHorizontal size={19} />
                  </button>

                </div>

              </div>

              {/* Empty State */}
              <div className="hidden p-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <CalendarDays size={21} className="text-gray-500" />
                </div>

                <h3 className="mt-4 font-semibold text-gray-900">
                  No tasks yet
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Add your first task to start working on this project.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>
    </>
  );
};

export default ProjectCard;

