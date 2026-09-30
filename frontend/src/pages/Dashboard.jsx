import { useState, useEffect } from "react";

import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import api from "../services/api";
import { getStoredUser } from "../services/auth.js";
import { useToast } from "../toastContext.js";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import DashboardHeader from "../components/DashboardHeader.jsx";
import ProjectSection from "../components/ProjectSection.jsx";

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
import DashboardStats from "../components/DashboardStats.jsx";
import {getTaskStats} from "../utils/taskStats.js";
import {statByProject} from "../utils/statByProject.js";
import ActivityTimeline from "../components/activity/ActivityTimeline.jsx";

const Dashboard = () => {
  const user = getStoredUser();
  const toast = useToast();

  // =========================
  // DATA STATE
  // =========================
  const [dataState, setDataState] = useState({
    projects: [],
    projectsPagination: null,
    tasks: [],
    activities: [],
    activitiesPagination: null,
  });

  // =========================
  // STATUS STATE
  // =========================

  const [status, setStatus] = useState({
    loading: true,
    error: null,
    deleting: false,
  });

  // =========================
  // UI STATE
  // =========================

  const [uiState, setUiState] = useState({
    search: "",
    projectToDelete: null,
    page: 1,
    limit: 5,
  });

  // =========================
  // FETCH DASHBOARD DATA
  // =========================

  const fetchData = async () => {
    setStatus((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const [projectsResponse, tasksResponse, activitiesResponse] = await Promise.all([
        api.get("/projects/", {
          params: {
            page: 1,
            limit: 5,
          }
        }),
        api.get("/tasks/all"),
        api.get("/activities/", {
          params: {
            page: 1,
            limit: 5,
          },
        }),
      ]);

      setDataState({
        projects: projectsResponse.data.message || [],
        projectsPagination: projectsResponse.data.pagination || null,
        tasks: tasksResponse.data.message || [],
        activities: activitiesResponse.data.message || [],
        activitiesPagination: activitiesResponse.data.pagination || null,
      });
    } catch (err) {
      setStatus((prev) => ({
        ...prev,
        error:
          err.response?.data?.message ||
          "We couldn't load your dashboard. Please try again.",
      }));

      setDataState((prev) => ({
      ...prev,
      projects: [],
      projectsPagination: null,
      tasks: [],
      activities: [],
      activitiesPagination: null,
    }));
    } finally {
      setStatus((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =========================
  // DELETE PROJECT
  // =========================

  const handleDeleteProject = async () => {
    const project = uiState.projectToDelete;

    if (!project) return;

    setStatus((prev) => ({
      ...prev,
      deleting: true,
    }));

    try {
      await api.delete(`/projects/delete/${project._id}`);

      setDataState((prev) => ({
        projects: prev.projects.filter(
          (currentProject) => currentProject._id !== project._id,
        ),
        projectsPagination: prev.projectsPagination,
        tasks: prev.tasks.filter((task) => task.project !== project._id),
      }));

      toast.success("Project deleted successfully.");

      setUiState((prev) => ({
        ...prev,
        projectToDelete: null,
      }));
    } catch (err) {
      console.error("Error deleting project:", err);

      toast.error(
        err.response?.data?.message ||
          "We couldn't delete this project. Please try again.",
      );
    } finally {
      setStatus((prev) => ({
        ...prev,
        deleting: false,
      }));
    }
  };

  // =========================
  // PAGINATION HANDLERS
  // =========================

  const handleNextPage = () => {
    if (!dataState.projectsPagination) return;

    if (!dataState.projectsPagination.hasNextPage) return;

    setUiState((prev) => ({
      ...prev,
      page: prev.page + 1,
    }));
  };

  const handlePreviousPage = () => {
    if (!dataState.projectsPagination) return;

    if (!dataState.projectsPagination.hasPrevPage) return;

    setUiState((prev) => ({
      ...prev,
      page: prev.page - 1,
    }));
  };


  // =========================
  // TASK STATISTICS
  // =========================

  const {
  total,
  completed,
        inProgress,
        completionRate,
} = getTaskStats(dataState.tasks);

  // =========================
  // PROJECT TASK STATISTICS
  // =========================

  const statsByProject = dataState.tasks.reduce((acc, task) => {
    const key = task.project;

    if (!acc[key]) {
      acc[key] = {
        total: 0,
        completed: 0,
      };
    }

    acc[key].total += 1;

    if (task.status === "completed") {
      acc[key].completed += 1;
    }

    return acc;
  }, {});

  // =========================
  // SEARCH
  // =========================

  const term = uiState.search.trim().toLowerCase();
  const filteredProjects = dataState.projects.filter((project) => {
    if (!term) return true;

    return (
      project.name.toLowerCase().includes(term) ||
      project.details.toLowerCase().includes(term)
    );
  });

  // =========================
  // DASHBOARD STATS
  // =========================

  const stats = [
    {
      label: "Total Projects",
      value: dataState.projects.length,
      icon: <FolderKanban size={18} className="text-blue-600" />,
    },
    {
      label: "Total Tasks",
      value: total,
      icon: <ListTodo size={18} className="text-amber-600" />,
    },
    {
      label: "In-Progress Tasks",
      value: inProgress,
      icon: <Clock3 size={18} className="text-yellow-600" />,
    },
    {
      label: "Completed Tasks",
      value: completed,
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
          {/* =========================
              WELCOME HEADER
          ========================= */}

          <DashboardHeader user={user} />

          {/* =========================
              LOADING
          ========================= */}

          {status.loading ? (
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
              
              <div className="h-64 animate-pulse rounded-xl bg-white" />
            </div>
          ) : status.error ? (
            /* =========================
               ERROR
            ========================= */

            <div className="rounded-xl bg-red-50 p-6 text-center">
              <p className="text-sm text-red-700">{status.error}</p>

              <button
                onClick={fetchData}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                <RefreshCw size={16} />
                Try Again
              </button>
            </div>
          ) : (
            /* =========================
               DASHBOARD CONTENT
            ========================= */

            <>
              {/* =========================
                  STATISTICS
              ========================= */}

              <DashboardStats stats={stats} />

              {/* =========================
                  PROJECTS
              ========================= */}

              <ProjectSection
                projects={dataState.projects}
                filteredProjects={filteredProjects}
                search={uiState.search}
                onSearchChange={(value) =>
                  setUiState((prev) => ({
                    ...prev,
                    search: value,
                  }))
                }
                statsByProject={statsByProject}
                onDelete={(project) =>
                  setUiState((prev) => ({
                    ...prev,
                    projectToDelete: project,
                  }))}
                  onNextPage={handleNextPage}
                  onPreviousPage={handlePreviousPage}
                  pagination={dataState.projectsPagination}
              />
              
          <ActivityTimeline activities={dataState.activities} />
            </>
          )}
        </div>
      </section>
      {/* =========================
          DELETE CONFIRMATION
      ========================= */}

      <ConfirmDialog
        isOpen={Boolean(uiState.projectToDelete)}
        title="Delete this project?"
        message={
          uiState.projectToDelete
            ? `"${uiState.projectToDelete.name}" and all of its tasks will be permanently deleted. This cannot be undone.`
            : ""
        }
        confirmLabel="Delete Project"
        loading={status.deleting}
        onConfirm={handleDeleteProject}
        onCancel={() =>
          setUiState((prev) => ({
            ...prev,
            projectToDelete: null,
          }))
        }
      />
    </>
  );
};

export default Dashboard;
