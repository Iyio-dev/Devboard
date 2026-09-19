import { useState, useEffect } from "react";

import Navbar from "./Navbar";
import api from "../services/api";
import UpdateProject from "./UpdateProject";

import { Link, useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

const ProjectCard = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [projectLoading, setProjectLoading] = useState(true);
  const [projectDeleteLoading, setProjectDeleteLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);

  const [projectTasks, setProjectTasks] = useState([]);

  // Add task states
  const [taskName, setTaskName] = useState("");
  const [taskDetails, setTaskDetails] = useState("");
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [addTaskLoading, setAddTaskLoading] = useState(false);

  // Edit task states
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [taskEditId, setTaskEditId] = useState("");
  const [editTaskName, setEditTaskName] = useState("");
  const [editTaskDetails, setEditTaskDetails] = useState("");

  // Fetch project and tasks
  const fetchProjectData = async () => {
    try {
      setProjectLoading(true);
      setError(null);

      const [projectResponse, tasksResponse] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/projects/${id}/tasks`),
      ]);

      setProject(projectResponse.data.message);
      setProjectTasks(tasksResponse.data.message);
    } catch (error) {
      console.error("Error fetching project:", error);

      setError(
        error.response?.data?.message ||
          "An error occurred while fetching the project.",
      );
    } finally {
      setProjectLoading(false);
    }
  };

  // Delete project
  const deleteProject = async (projectId, e) => {
    try {
      e.preventDefault();
      e.stopPropagation();

      setProjectDeleteLoading(true);

      await api.delete(`/projects/delete/${projectId}`);

      navigate("/dashboard");
    } catch (error) {
      setProjectDeleteLoading(false);

      console.error("Error deleting project:", error);

      setError(
        error.response?.data?.message ||
          "An error occurred while deleting the project.",
      );
    }
  };

  // Add task
  const addTask = async (e) => {
    e.preventDefault();

    setAddTaskLoading(true);

    try {
      const response = await api.post(`/tasks/${id}/create`, {
        name: taskName,
        details: taskDetails,
      });

      setShowAddTaskForm(false);

      setProjectTasks((prevTasks) => [...prevTasks, response.data?.result]);

      setTaskName("");
      setTaskDetails("");
    } catch (error) {
      console.error("Error adding task:", error);

      setError(
        error.response?.data?.message ||
          "An error occurred while adding the task.",
      );
    } finally {
      setAddTaskLoading(false);
    }
  };

  // Complete task
  const completeTask = async (taskId, e) => {
    e.preventDefault();

    try {
      await api.patch(`/tasks/complete/${taskId}`);

      setProjectTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: "completed" } : task,
        ),
      );
    } catch (error) {
      console.error("Error completing task:", error);

      setError(
        error.response?.data?.message ||
          "An error occurred while completing the task.",
      );
    }
  };

  // Delete task
  const deleteTask = async (taskId, e) => {
    e.preventDefault();

    try {
      await api.delete(`/tasks/delete/${taskId}`);

      setProjectTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== taskId),
      );
    } catch (error) {
      console.error("Error deleting task:", error);

      setError(
        error.response?.data?.message ||
          "An error occurred while deleting the task.",
      );
    }
  };

  // Get task details for edit modal
  const fillEditTaskDetails = async (taskId) => {
    try {
      const response = await api.get(`/tasks/${taskId}`);

      setEditTaskName(response.data.message.name);
      setEditTaskDetails(response.data.message.details);
    } catch (error) {
      console.error("Error fetching task:", error);

      setError(
        error.response?.data?.message ||
          "An error occurred while fetching the task.",
      );
    }
  };

  // Edit task
  const editTask = async (e) => {
    e.preventDefault();

    try {
      const response = await api.put(`/tasks/update/${taskEditId}`, {
        name: editTaskName,
        details: editTaskDetails,
      });

      setProjectTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskEditId
            ? {
                ...task,
                name: response.data.result.name,
                details: response.data.result.details,
              }
            : task,
        ),
      );
    } catch (error) {
      console.error("Error editing task:", error);

      setError(
        error.response?.data?.message ||
          "An error occurred while editing the task.",
      );
    } finally {
      setShowEditTaskModal(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps -- fetch once per project id

  // Task statistics
  const completedTasks = projectTasks.filter(
    (task) => task.status === "completed",
  ).length;

  const progress =
    projectTasks.length > 0
      ? Math.round((completedTasks / projectTasks.length) * 100)
      : 0;

  // Loading state
  if (projectLoading) {
    return (
      <>
        <Navbar />

        <section className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900"></div>

            <p className="mt-4 text-sm text-gray-500">Loading project...</p>
          </div>
        </section>
      </>
    );
  }

  // Delete loading state
  if (projectDeleteLoading) {
    return (
      <>
        <Navbar />

        <section className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900"></div>

            <p className="mt-4 text-sm text-gray-500">Deleting project...</p>
          </div>
        </section>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Navbar />

        <section className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <span className="text-lg font-bold text-red-600">!</span>
            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">Error</h2>

            <p className="mt-2 text-sm text-gray-500">{error}</p>

            <button
              onClick={fetchProjectData}
              className="mt-5 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Try Again
            </button>
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
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
            >
              <ArrowLeft size={17} />
              Back to Dashboard
            </Link>
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

                {/* Project actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowEditProjectModal(true)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Edit Project
                  </button>

                  <button
                    onClick={(e) => deleteProject(project._id, e)}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>

            {/* Project Statistics */}
            <div className="grid border-b border-gray-100 sm:grid-cols-3">
              {/* Total Tasks */}
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
                      {projectTasks.length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Completed Tasks */}
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
                      {completedTasks}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress */}
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
                      {progress}%
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

                <p className="text-sm font-medium text-gray-500">{progress}%</p>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-gray-900 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Add Task Form */}
          {showAddTaskForm ? (
            <div className="mt-8 rounded-2xl bg-white shadow-sm border-b border-gray-100 p-6">
              <form onSubmit={addTask}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Task name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter task name"
                    onChange={(e) => setTaskName(e.target.value)}
                    value={taskName}
                    className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:border-gray-900"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Task details
                  </label>

                  <textarea
                    placeholder="Enter task details"
                    rows="3"
                    onChange={(e) => setTaskDetails(e.target.value)}
                    value={taskDetails}
                    className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:border-gray-900"
                  />
                </div>

                <div className="mt-5 flex gap-3">
                  {addTaskLoading ? (
                    <div className="flex items-center">
                      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900"></div>

                      <span className="ml-2">Creating task...</span>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                    >
                      Create Task
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowAddTaskForm(false)}
                    className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
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

                <button
                  onClick={() => setShowAddTaskForm(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  <Plus size={17} />
                  Add Task
                </button>
              </div>

              {/* Task List */}
              <div className="divide-y divide-gray-100">
                {projectTasks.length === 0 ? (
                  <div className="p-12 text-center">
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
                ) : (
                  <>
                    {/* Incomplete Tasks */}
                    {projectTasks
                      .filter((task) => task.status !== "completed")
                      .map((task) => (
                        <div
                          className="flex items-center justify-between gap-4 p-5 transition hover:bg-gray-50"
                          key={task._id}
                        >
                          <div className="flex min-w-0 items-center gap-4">
                            <button
                              type="button"
                              onClick={(e) => completeTask(task._id, e)}
                              className="shrink-0 text-gray-400 transition hover:text-gray-900"
                            >
                              <Circle size={21} />
                            </button>

                            <div className="min-w-0">
                              <h3 className="truncate font-medium text-gray-900">
                                {task.name}
                              </h3>

                              <p className="mt-1 truncate text-sm text-gray-500">
                                {task.details}
                              </p>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-3">
                            <span className="hidden rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700 sm:inline-block">
                              In Progress
                            </span>

                            <button
                              onClick={(e) => deleteTask(task._id, e)}
                              className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                              title="Delete task"
                            >
                              <Trash2 size={19} />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();

                                setTaskEditId(task._id);

                                fillEditTaskDetails(task._id);

                                setShowEditTaskModal(true);
                              }}
                              className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-blue-600"
                              title="Edit task"
                            >
                              <Pencil size={16} />
                            </button>
                          </div>
                        </div>
                      ))}

                    {/* Completed Tasks */}
                    {projectTasks
                      .filter((task) => task.status === "completed")
                      .map((task) => (
                        <div
                          className="flex items-center justify-between gap-4 p-5 transition hover:bg-gray-50"
                          key={task._id}
                        >
                          <div className="flex min-w-0 items-center gap-4">
                            <button
                              type="button"
                              className="shrink-0 text-gray-900"
                            >
                              <CheckCircle2 size={21} />
                            </button>

                            <div className="min-w-0">
                              <h3 className="truncate font-medium text-gray-400 line-through">
                                {task.name}
                              </h3>

                              <p className="mt-1 truncate text-sm text-gray-400">
                                {task.details}
                              </p>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-3">
                            <span className="hidden rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 sm:inline-block">
                              Completed
                            </span>

                            <button
                              onClick={(e) => deleteTask(task._id, e)}
                              className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                              title="Delete task"
                            >
                              <Trash2 size={19} />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();

                                setTaskEditId(task._id);

                                fillEditTaskDetails(task._id);

                                setShowEditTaskModal(true);
                              }}
                              className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-blue-600"
                              title="Edit task"
                            >
                              <Pencil size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Edit Task Modal */}
          {showEditTaskModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
              <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                {/* Header */}
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Edit Task
                  </h2>

                  <button
                    type="button"
                    onClick={() => setShowEditTaskModal(false)}
                    className="text-gray-500 hover:text-gray-800"
                  >
                    ✕
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={editTask}>
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Task name
                    </label>

                    <input
                      type="text"
                      value={editTaskName}
                      onChange={(e) => setEditTaskName(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                      placeholder="Enter task name"
                    />
                  </div>

                  <div className="mb-5">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Details
                    </label>

                    <textarea
                      value={editTaskDetails}
                      onChange={(e) => setEditTaskDetails(e.target.value)}
                      rows="4"
                      className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                      placeholder="Enter task details"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowEditTaskModal(false)}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
      {showEditProjectModal && (
        <UpdateProject
          project={project}
          onClose={() => setShowEditProjectModal(false)}
          onUpdated={(updatedProject) => setProject(updatedProject)}
          onError={(error) => setError(error)}
        />
      )}
    </>
  );
};

export default ProjectCard;
