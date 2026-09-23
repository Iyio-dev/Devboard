import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import api from "../services/api";
import { getStoredUser } from "../services/auth.js";
import { useToast } from "../toastContext.js";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import {
  RefreshCw,
  FolderKanban,
  ListTodo,
  CheckCircle2,
  Clock3,
  Percent,
  Plus,
  Trash2,
  ArrowRight,
  Search,
} from "lucide-react";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const user = getStoredUser();
  const toast = useToast();

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [projectsResponse, tasksResponse] = await Promise.all([
        api.get("/projects/"),
        api.get("/tasks/all"),
      ]);

      setProjects(projectsResponse.data.message || []);
      setTasks(tasksResponse.data.message || []);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(
        err.response?.data?.message ||
          "We couldn't load your dashboard. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    setDeleteLoading(true);

    try {
      await api.delete(`/projects/delete/${projectToDelete._id}`);

      setProjects((current) =>
        current.filter((project) => project._id !== projectToDelete._id),
      );
      setTasks((current) =>
        current.filter((task) => task.project !== projectToDelete._id),
      );
      toast.success("Project deleted successfully.");
      setProjectToDelete(null);
    } catch (err) {
      console.error("Error deleting project:", err);
      toast.error(
        err.response?.data?.message ||
          "We couldn't delete this project. Please try again.",
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // Statistics (all derived from real API data)
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const inProgressTasks = totalTasks - completedTasks;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Per-project task/progress info
  const statsByProject = tasks.reduce((acc, task) => {
    const key = task.project;
    if (!acc[key]) acc[key] = { total: 0, completed: 0 };
    acc[key].total += 1;
    if (task.status === "completed") acc[key].completed += 1;
    return acc;
  }, {});

  // Client-side search over loaded projects
  const filteredProjects = projects.filter((project) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return (
      project.name.toLowerCase().includes(term) ||
      project.details.toLowerCase().includes(term)
    );
  });

  const stats = [
    {
      label: "Total Projects",
      value: projects.length,
      icon: <FolderKanban size={18} className="text-blue-600" />,
    },
    {
      label: "Total Tasks",
      value: totalTasks,
      icon: <ListTodo size={18} className="text-amber-600" />,
    },
    {
      label: "In-Progress Tasks",
      value: inProgressTasks,
      icon: <Clock3 size={18} className="text-yellow-600" />,
    },
    {
      label: "Completed Tasks",
      value: completedTasks,
      icon: <CheckCircle2 size={18} className="text-green-600" />,
    },
    {
      label: "Completion Rate",
      value: `${completionRate}%`,
      icon: <Percent size={18} className="text-purple-600" />,
    },
  ];

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Welcome header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""} 👋
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

          {loading ? (
            /* Skeleton loading state */
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="h-28 animate-pulse rounded-xl bg-white"
                  />
                ))}
              </div>

              <div className="h-64 animate-pulse rounded-xl bg-white" />
            </div>
          ) : error ? (
            /* Error state */
            <div className="rounded-xl bg-red-50 p-6 text-center">
              <p className="text-sm text-red-700">{error}</p>

              <button
                onClick={fetchData}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                <RefreshCw size={16} />
                Try Again
              </button>
            </div>
          ) : (
            <>
              {/* Statistics cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl bg-white p-5 shadow-sm"
                  >
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

              {/* Projects section */}
              <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Your Projects
                  </h2>

                  {projects.length > 0 && (
                    <div className="relative sm:w-64">
                      <Search
                        size={16}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search projects..."
                        aria-label="Search projects"
                        className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-gray-900"
                      />
                    </div>
                  )}
                </div>

                {projects.length === 0 ? (
                  /* Empty state */
                  <div className="py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                      <FolderKanban size={21} className="text-gray-500" />
                    </div>

                    <h3 className="mt-4 font-semibold text-gray-900">
                      You don't have any projects yet
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Create your first project to start tracking tasks and
                      progress.
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
                  /* No search results */
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
                          ? Math.round(
                              (projectStats.completed / projectStats.total) *
                                100,
                            )
                          : 0;

                      return (
                        <div
                          key={project._id}
                          className="flex flex-col rounded-lg border border-gray-200 p-4 transition hover:border-gray-300 hover:shadow-sm"
                        >
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

                            {/* Progress bar */}
                            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
                              <div
                                className="h-full rounded-full bg-gray-900 transition-all duration-300"
                                style={{ width: `${projectProgress}%` }}
                              />
                            </div>

                            <p className="mt-2 text-xs text-gray-500">
                              {projectStats.completed} / {projectStats.total}{" "}
                              tasks completed
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
                              onClick={() => setProjectToDelete(project)}
                              className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                              aria-label={`Delete project ${project.name}`}
                              title="Delete project"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={Boolean(projectToDelete)}
        title="Delete this project?"
        message={
          projectToDelete
            ? `"${projectToDelete.name}" and all of its tasks will be permanently deleted. This cannot be undone.`
            : ""
        }
        confirmLabel="Delete Project"
        loading={deleteLoading}
        onConfirm={handleDeleteProject}
        onCancel={() => setProjectToDelete(null)}
      />
    </>
  );
};

export default Dashboard;
