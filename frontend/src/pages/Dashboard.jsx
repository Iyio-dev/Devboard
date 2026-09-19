import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import api from "../services/api";
import { RefreshCw } from "lucide-react";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [projectsCount, setProjectsCount] = useState(0);
  const [tasksCount, setTasksCount] = useState(0);
  const [projectLoading, setProjectLoading] = useState(true);
  const [projectError, setProjectError] = useState(null);
  const [completedTasksCount, setCompletedTasksCount] = useState(0);

  const fetchProjects = async () => {
    setProjectLoading(true);
    setProjectError(null);

    try {
      const response = await api.get("/projects/");

      setProjects(response.data.message);
      setProjectsCount(response.data.message.length);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjectError(
        error.response?.data?.message ||
          "Failed to load projects. Please try again later.",
      );
    } finally {
      setProjectLoading(false);
    }
  };

  const countTaskStats = async () => {
    try {
      const response = await api.get("/tasks/all");

      const tasks = response.data.message || [];

      const completedTasks = tasks.filter(
        (task) => task.status === "completed",
      );

      setTasksCount(tasks.length);
      setCompletedTasksCount(completedTasks.length);
    } catch (error) {
      console.error(
        "Error fetching all tasks:",
        error.response ? error.response.data : error.message,
      );
    }
  };

  useEffect(() => {
    fetchProjects();
    countTaskStats();
  }, []);

  const deleteProject = async (projectId, e) => {
    try {
      e.preventDefault();
      e.stopPropagation();

      await api.delete(`/projects/delete/${projectId}`);

      setProjects((currentProjects) =>
        currentProjects.filter((project) => project._id !== projectId),
      );
      setProjectsCount((currentCount) => currentCount - 1);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-gray-100 px-6 py-8">
        <div className="mx-auto max-w-6xl">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

            <p className="mt-2 text-gray-600">
              Welcome back! Here's an overview of your projects and tasks.
            </p>
          </div>

          {/* Statistics */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Total Projects */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">Total Projects</p>

              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                {projectsCount}
              </h2>
            </div>

            {/* Active Projects */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">All tasks</p>

              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                {tasksCount}
              </h2>
            </div>

            {/* Completed Tasks */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">Completed Tasks</p>

              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                {completedTasksCount}
              </h2>
            </div>
          </div>

          {/* Projects */}
          <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Your Projects
            </h2>

            {projectLoading ? (
              <p className="mt-8 text-gray-500">Loading projects...</p>
            ) : projectError ? (
              <div className="flex items-center justify-between mb-4 mt-4 rounded-lg bg-red-100 p-4">
                <div className="text-sm text-red-700">{projectError}</div>
                <button
                  onClick={fetchProjects}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                  <RefreshCw size={16} />
                  Retry
                </button>
              </div>
            ) : projects.length === 0 ? (
              <p className="mt-2 text-gray-500">
                You haven't created any projects yet.
              </p>
            ) : (
              <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    className="rounded-lg border border-gray-200 p-4"
                  >
                    <Link to={`/projects/${project._id}`} className="block">
                      <h3 className="font-semibold text-gray-900">
                        {project.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-600">
                        {project.details}
                      </p>
                    </Link>

                    <div className="mt-4 flex items-center justify-between">
                      <button
                        onClick={(e) => deleteProject(project._id, e)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Delete Project
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Create Project Button */}
            <Link
              to="/create-project"
              className="mt-4 inline-block rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Create Project
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
