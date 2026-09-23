import { useState, useEffect } from "react";

import Navbar from "./Navbar";
import api from "../services/api";
import UpdateProject from "./UpdateProject";
import ConfirmDialog from "./ConfirmDialog.jsx";
import { useToast } from "../toastContext.js";

import { Link, useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  Plus,
  Pencil,
  RotateCcw,
  Search,
  Trash2,
} from "lucide-react";

// Task filter tabs
const FILTERS = ["All", "In Progress", "Completed"];

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [project, setProject] = useState(null);
  const [projectLoading, setProjectLoading] = useState(true);
  const [projectDeleteLoading, setProjectDeleteLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [showDeleteProjectDialog, setShowDeleteProjectDialog] = useState(false);

  const [projectTasks, setProjectTasks] = useState([]);

  // Task filter + search
  const [taskFilter, setTaskFilter] = useState("All");
  const [taskSearch, setTaskSearch] = useState("");

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
  const [editTaskLoading, setEditTaskLoading] = useState(false);

  // Task to delete (confirmation dialog)
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleteTaskLoading, setDeleteTaskLoading] = useState(false);

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
          "We couldn't load this project. Please try again.",
      );
    } finally {
      setProjectLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps -- fetch once per project id

  // Delete project
  const deleteProject = async () => {
    try {
      setProjectDeleteLoading(true);

      await api.delete(`/projects/delete/${project._id}`);

      toast.success("Project deleted successfully.");
      navigate("/dashboard");
    } catch (error) {
      setProjectDeleteLoading(false);
      setShowDeleteProjectDialog(false);

      console.error("Error deleting project:", error);

      toast.error(
        error.response?.data?.message ||
          "We couldn't delete this project. Please try again.",
      );
    }
  };

  // Add task
  const addTask = async (e) => {
    e.preventDefault();

    if (!taskName.trim() || !taskDetails.trim()) {
      toast.error("Please fill in both the task name and details.");
      return;
    }

    setAddTaskLoading(true);

    try {
      const response = await api.post(`/tasks/${id}/create`, {
        name: taskName,
        details: taskDetails,
      });

      setShowAddTaskForm(false);

      setProjectTasks((prevTasks) => [response.data?.result, ...prevTasks]);

      setTaskName("");
      setTaskDetails("");
      toast.success("Task created successfully.");
    } catch (error) {
      console.error("Error adding task:", error);

      toast.error(
        error.response?.data?.message ||
          "We couldn't create this task. Please try again.",
      );
    } finally {
      setAddTaskLoading(false);
    }
  };

  // Complete / re-open task (the backend toggles the status)
  const toggleTaskStatus = async (taskId) => {
    const previousTasks = projectTasks;

    // Optimistic update so the UI responds instantly
    setProjectTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId
          ? {
              ...task,
              status:
                task.status === "completed" ? "in-progress" : "completed",
            }
          : task,
      ),
    );

    try {
      const response = await api.patch(`/tasks/complete/${taskId}`);

      // Sync with the server's response
      setProjectTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: response.data.result.status } : task,
        ),
      );

      const nowCompleted = response.data.result.status === "completed";
      toast.success(nowCompleted ? "Task completed." : "Task re-opened.");
    } catch (error) {
      console.error("Error updating task status:", error);

      // Roll back to the previous list on failure
      setProjectTasks(previousTasks);

      toast.error(
        error.response?.data?.message ||
          "We couldn't update this task. Please try again.",
      );
    }
  };

  // Delete task
  const deleteTask = async () => {
    if (!taskToDelete) return;

    setDeleteTaskLoading(true);

    try {
      await api.delete(`/tasks/delete/${taskToDelete._id}`);

      setProjectTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== taskToDelete._id),
      );
      toast.success("Task deleted successfully.");
      setTaskToDelete(null);
    } catch (error) {
      console.error("Error deleting task:", error);

      toast.error(
        error.response?.data?.message ||
          "We couldn't delete this task. Please try again.",
      );
    } finally {
      setDeleteTaskLoading(false);
    }
  };

  // Open the edit modal — the task data is already in state,
  // so no extra API call is needed.
  const openEditTaskModal = (task) => {
    setTaskEditId(task._id);
    setEditTaskName(task.name);
    setEditTaskDetails(task.details);
    setShowEditTaskModal(true);
  };

  // Edit task
  const editTask = async (e) => {
    e.preventDefault();

    setEditTaskLoading(true);

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

      toast.success("Task updated successfully.");
      setShowEditTaskModal(false);
    } catch (error) {
      console.error("Error editing task:", error);

      toast.error(
        error.response?.data?.message ||
          "We couldn't update this task. Please try again.",
      );
    } finally {
      setEditTaskLoading(false);
    }
  };

  // Task statistics
  const completedTasks = projectTasks.filter(
    (task) => task.status === "completed",
  ).length;

  const progress =
    projectTasks.length > 0
      ? Math.round((completedTasks / projectTasks.length) * 100)
      : 0;

  // Apply the status filter tab + search text to the visible task list
  const visibleTasks = projectTasks.filter((task) => {
    const matchesFilter =
      taskFilter === "All" ||
      (taskFilter === "Completed" && task.status === "completed") ||
      (taskFilter === "In Progress" && task.status !== "completed");

    const term = taskSearch.trim().toLowerCase();
    const matchesSearch =
      !term ||
      task.name.toLowerCase().includes(term) ||
      task.details.toLowerCase().includes(term);

    return matchesFilter && matchesSearch;
  });

  // Loading state
  if (projectLoading) {
    return (
      <>
        <Navbar />

        <section className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 h-5 w-40 animate-pulse rounded bg-gray-200" />

            <div className="h-64 animate-pulse rounded-2xl bg-white shadow-sm" />

            <div className="mt-8 h-96 animate-pulse rounded-2xl bg-white shadow-sm" />
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

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              Something went wrong
            </h2>

            <p className="mt-2 text-sm text-gray-500">{error}</p>

            <div className="mt-5 flex justify-center gap-3">
              <button
                onClick={fetchProjectData}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Try Again
              </button>

              <Link
                to="/dashboard"
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Back to Dashboard
              </Link>
            </div>
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
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => setShowEditProjectModal(true)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Edit Project
                  </button>

                  <button
                    onClick={() => setShowDeleteProjectDialog(true)}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>

            {/* Project Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-3">
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
                  {completedTasks} / {projectTasks.length} tasks completed
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
            <div className="mt-8 rounded-2xl border-b border-gray-100 bg-white p-6 shadow-sm">
              <form onSubmit={addTask}>
                <div>
                  <label
                    htmlFor="taskName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Task name
                  </label>

                  <input
                    type="text"
                    id="taskName"
                    placeholder="Enter task name"
                    onChange={(e) => setTaskName(e.target.value)}
                    value={taskName}
                    required
                    className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:border-gray-900"
                  />
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="taskDetails"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Task details
                  </label>

                  <textarea
                    id="taskDetails"
                    placeholder="Enter task details"
                    rows="3"
                    onChange={(e) => setTaskDetails(e.target.value)}
                    value={taskDetails}
                    required
                    className="mt-2 w-full rounded-lg border border-gray-200 px-4 py-2.5 outline-none focus:border-gray-900"
                  />
                </div>

                <div className="mt-5 flex gap-3">
                  <button
                    type="submit"
                    disabled={addTaskLoading}
                    className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {addTaskLoading ? "Creating..." : "Create Task"}
                  </button>

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
                  <h2 className="text-xl font-bold text-gray-900">Tasks</h2>

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

              {/* Filter tabs + search */}
              {projectTasks.length > 0 && (
                <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
                    {FILTERS.map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setTaskFilter(filter)}
                        className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition sm:flex-none ${
                          taskFilter === filter
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>

                  <div className="relative sm:w-64">
                    <Search
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      value={taskSearch}
                      onChange={(e) => setTaskSearch(e.target.value)}
                      placeholder="Search tasks..."
                      aria-label="Search tasks"
                      className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-gray-900"
                    />
                  </div>
                </div>
              )}

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
                ) : visibleTasks.length === 0 ? (
                  <div className="p-12 text-center">
                    <p className="text-sm text-gray-500">
                      No tasks match your current filter or search.
                    </p>
                  </div>
                ) : (
                  visibleTasks.map((task) => {
                    const isCompleted = task.status === "completed";

                    return (
                      <div
                        className="flex items-center justify-between gap-4 p-5 transition hover:bg-gray-50"
                        key={task._id}
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <button
                            type="button"
                            onClick={() => toggleTaskStatus(task._id)}
                            title={
                              isCompleted
                                ? "Mark as in-progress"
                                : "Mark as completed"
                            }
                            aria-label={
                              isCompleted
                                ? "Mark task as in-progress"
                                : "Mark task as completed"
                            }
                            className={`shrink-0 transition ${
                              isCompleted
                                ? "text-gray-900 hover:text-gray-600"
                                : "text-gray-400 hover:text-gray-900"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 size={21} />
                            ) : (
                              <Circle size={21} />
                            )}
                          </button>

                          <div className="min-w-0">
                            <h3
                              className={`truncate font-medium ${
                                isCompleted
                                  ? "text-gray-400 line-through"
                                  : "text-gray-900"
                              }`}
                            >
                              {task.name}
                            </h3>

                            <p
                              className={`mt-1 truncate text-sm ${
                                isCompleted ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {task.details}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                              isCompleted
                                ? "bg-green-50 text-green-700"
                                : "bg-yellow-50 text-yellow-700"
                            }`}
                          >
                            {isCompleted ? (
                              <>
                                <CheckCircle2 size={12} />
                                Completed
                              </>
                            ) : (
                              <>
                                <Clock3 size={12} />
                                In Progress
                              </>
                            )}
                          </span>

                          <button
                            type="button"
                            onClick={() => toggleTaskStatus(task._id)}
                            title={
                              isCompleted
                                ? "Mark as in-progress"
                                : "Mark as completed"
                            }
                            aria-label={
                              isCompleted
                                ? "Mark task as in-progress"
                                : "Mark task as completed"
                            }
                            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-900"
                          >
                            {isCompleted ? <RotateCcw size={16} /> : <CheckCircle2 size={16} />}
                          </button>

                          <button
                            onClick={() => setTaskToDelete(task)}
                            className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                            title="Delete task"
                            aria-label={`Delete task ${task.name}`}
                          >
                            <Trash2 size={19} />
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditTaskModal(task)}
                            className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-blue-600"
                            title="Edit task"
                            aria-label={`Edit task ${task.name}`}
                          >
                            <Pencil size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Edit Task Modal */}
      {showEditTaskModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-task-title"
        >
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
              <h2
                id="edit-task-title"
                className="text-xl font-semibold text-gray-900"
              >
                Edit Task
              </h2>

              <button
                type="button"
                onClick={() => setShowEditTaskModal(false)}
                className="text-gray-500 hover:text-gray-800"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={editTask}>
              <div className="mb-4">
                <label
                  htmlFor="editTaskName"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Task name
                </label>

                <input
                  type="text"
                  id="editTaskName"
                  value={editTaskName}
                  onChange={(e) => setEditTaskName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                  placeholder="Enter task name"
                  required
                />
              </div>

              <div className="mb-5">
                <label
                  htmlFor="editTaskDetails"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Details
                </label>

                <textarea
                  id="editTaskDetails"
                  value={editTaskDetails}
                  onChange={(e) => setEditTaskDetails(e.target.value)}
                  rows="4"
                  className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                  placeholder="Enter task details"
                  required
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
                  disabled={editTaskLoading}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {editTaskLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete project confirmation */}
      <ConfirmDialog
        isOpen={showDeleteProjectDialog}
        title="Delete this project?"
        message={`"${project?.name}" and all of its tasks will be permanently deleted. This cannot be undone.`}
        confirmLabel="Delete Project"
        loading={projectDeleteLoading}
        onConfirm={deleteProject}
        onCancel={() => setShowDeleteProjectDialog(false)}
      />

      {/* Delete task confirmation */}
      <ConfirmDialog
        isOpen={Boolean(taskToDelete)}
        title="Delete this task?"
        message={
          taskToDelete
            ? `"${taskToDelete.name}" will be permanently deleted. This cannot be undone.`
            : ""
        }
        confirmLabel="Delete Task"
        loading={deleteTaskLoading}
        onConfirm={deleteTask}
        onCancel={() => setTaskToDelete(null)}
      />

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

export default ProjectDetails;
