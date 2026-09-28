import { useState, useEffect } from "react";

import Navbar from "./Navbar.jsx";
import api from "../services/api.js";
import UpdateProject from "./UpdateProject.jsx";
import ConfirmDialog from "./ConfirmDialog.jsx";
import TaskSection from "./project/TaskSection.jsx";

import { useToast } from "../toastContext.js";

import { Link, useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock3,
  Pencil,
  RotateCcw,
  Trash2,
} from "lucide-react";

const FILTERS = ["All", "In Progress", "Completed"];

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  // =========================
  // PROJECT STATE
  // =========================

  const [projectState, setProjectState] = useState({
    data: null,
    loading: true,
    error: null,
    deleting: false,
  });

  // =========================
  // TASK STATE
  // =========================

  const [taskState, setTaskState] = useState({
    data: [],
    adding: false,
    editing: false,
    deleting: false,
    updatingTaskId: null,
  });

  // =========================
  // TASK FORM STATE
  // =========================

  const [taskForm, setTaskForm] = useState({
    name: "",
    details: "",
    editId: "",
  });

  // =========================
  // UI STATE
  // =========================

  const [uiState, setUiState] = useState({
    showAddTaskForm: false,
    showEditTaskModal: false,
    showEditProjectModal: false,
    showDeleteProjectDialog: false,
    taskToDelete: null,
    taskFilter: "All",
    taskSearch: "",
  });

  // =========================
  // FETCH PROJECT + TASKS
  // =========================

  const fetchProjectData = async () => {
    setProjectState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const [projectResponse, tasksResponse] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/projects/${id}/tasks`),
      ]);

      setProjectState((prev) => ({
        ...prev,
        data: projectResponse.data.message,
      }));

      setTaskState((prev) => ({
        ...prev,
        data: tasksResponse.data.message,
      }));
    } catch (error) {
      console.error("Error fetching project:", error);

      setProjectState((prev) => ({
        ...prev,
        error:
          error.response?.data?.message ||
          "We couldn't load this project. Please try again.",
      }));
    } finally {
      setProjectState((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  // =========================
  // DELETE PROJECT
  // =========================

  const deleteProject = async () => {
    if (!projectState.data?._id) return;

    try {
      setProjectState((prev) => ({
        ...prev,
        deleting: true,
      }));

      await api.delete(`/projects/delete/${projectState.data._id}`);

      toast.success("Project deleted successfully.");

      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting project:", error);

      setProjectState((prev) => ({
        ...prev,
        deleting: false,
      }));

      setUiState((prev) => ({
        ...prev,
        showDeleteProjectDialog: false,
      }));

      toast.error(
        error.response?.data?.message ||
          "We couldn't delete this project. Please try again.",
      );
    }
  };

  // =========================
  // ADD TASK
  // =========================

  const addTask = async (e) => {
    e.preventDefault();

    if (!taskForm.name.trim() || !taskForm.details.trim()) {
      toast.error("Please fill in both the task name and details.");
      return;
    }

    setTaskState((prev) => ({
      ...prev,
      adding: true,
    }));

    try {
      const response = await api.post(`/tasks/${id}/create`, {
        name: taskForm.name.trim(),
        details: taskForm.details.trim(),
      });

      setTaskState((prev) => ({
        ...prev,
        data: [response.data.result, ...prev.data],
      }));

      setTaskForm((prev) => ({
        ...prev,
        name: "",
        details: "",
      }));

      setUiState((prev) => ({
        ...prev,
        showAddTaskForm: false,
      }));

      toast.success("Task created successfully.");
    } catch (error) {
      console.error("Error adding task:", error);

      toast.error(
        error.response?.data?.message ||
          "We couldn't create this task. Please try again.",
      );
    } finally {
      setTaskState((prev) => ({
        ...prev,
        adding: false,
      }));
    }
  };

  // =========================
  // TOGGLE TASK STATUS
  // =========================

  const toggleTaskStatus = async (taskId) => {
    const previousTasks = [...taskState.data];

    setTaskState((prev) => ({
      ...prev,
      updatingTaskId: taskId,
      data: prev.data.map((task) =>
        task._id === taskId
          ? {
              ...task,
              status:
                task.status === "completed"
                  ? "in-progress"
                  : "completed",
            }
          : task,
      ),
    }));

    try {
      const response = await api.patch(`/tasks/complete/${taskId}`);

      setTaskState((prev) => ({
        ...prev,
        data: prev.data.map((task) =>
          task._id === taskId
            ? {
                ...task,
                status: response.data.result.status,
              }
            : task,
        ),
      }));

      toast.success(
        response.data.result.status === "completed"
          ? "Task completed."
          : "Task moved back to in progress.",
      );
    } catch (error) {
      console.error("Error updating task status:", error);

      setTaskState((prev) => ({
        ...prev,
        data: previousTasks,
      }));

      toast.error(
        error.response?.data?.message ||
          "We couldn't update this task. Please try again.",
      );
    } finally {
      setTaskState((prev) => ({
        ...prev,
        updatingTaskId: null,
      }));
    }
  };

  // =========================
  // DELETE TASK
  // =========================

  const deleteTask = async () => {
    if (!uiState.taskToDelete) return;

    const taskId = uiState.taskToDelete._id;

    setTaskState((prev) => ({
      ...prev,
      deleting: true,
    }));

    try {
      await api.delete(`/tasks/delete/${taskId}`);

      setTaskState((prev) => ({
        ...prev,
        data: prev.data.filter((task) => task._id !== taskId),
      }));

      toast.success("Task deleted successfully.");

      setUiState((prev) => ({
        ...prev,
        taskToDelete: null,
      }));
    } catch (error) {
      console.error("Error deleting task:", error);

      toast.error(
        error.response?.data?.message ||
          "We couldn't delete this task. Please try again.",
      );
    } finally {
      setTaskState((prev) => ({
        ...prev,
        deleting: false,
      }));
    }
  };

  // =========================
  // OPEN EDIT TASK MODAL
  // =========================

  const openEditTaskModal = (task) => {
    setTaskForm({
      name: task.name,
      details: task.details,
      editId: task._id,
    });

    setUiState((prev) => ({
      ...prev,
      showEditTaskModal: true,
    }));
  };

  // =========================
  // CLOSE EDIT TASK MODAL
  // =========================

  const closeEditTaskModal = () => {
    setUiState((prev) => ({
      ...prev,
      showEditTaskModal: false,
    }));

    setTaskForm({
      name: "",
      details: "",
      editId: "",
    });
  };

  // =========================
  // EDIT TASK
  // =========================

  const editTask = async (e) => {
    e.preventDefault();

    if (!taskForm.name.trim() || !taskForm.details.trim()) {
      toast.error("Please fill in both the task name and details.");
      return;
    }

    if (!taskForm.editId) {
      toast.error("No task selected for editing.");
      return;
    }

    setTaskState((prev) => ({
      ...prev,
      editing: true,
    }));

    try {
      const response = await api.put(
        `/tasks/update/${taskForm.editId}`,
        {
          name: taskForm.name.trim(),
          details: taskForm.details.trim(),
        },
      );

      setTaskState((prev) => ({
        ...prev,
        data: prev.data.map((task) =>
          task._id === taskForm.editId
            ? {
                ...task,
                name: response.data.result.name,
                details: response.data.result.details,
              }
            : task,
        ),
      }));

      toast.success("Task updated successfully.");

      closeEditTaskModal();
    } catch (error) {
      console.error("Error editing task:", error);

      toast.error(
        error.response?.data?.message ||
          "We couldn't update this task. Please try again.",
      );
    } finally {
      setTaskState((prev) => ({
        ...prev,
        editing: false,
      }));
    }
  };

  // =========================
  // DERIVED TASK DATA
  // =========================

  const completedTasks = taskState.data.filter(
    (task) => task.status === "completed",
  ).length;

  const progress =
    taskState.data.length > 0
      ? Math.round(
          (completedTasks / taskState.data.length) * 100,
        )
      : 0;

  const visibleTasks = taskState.data.filter((task) => {
    const matchesFilter =
      uiState.taskFilter === "All" ||
      (uiState.taskFilter === "Completed" &&
        task.status === "completed") ||
      (uiState.taskFilter === "In Progress" &&
        task.status !== "completed");

    const term = uiState.taskSearch.trim().toLowerCase();

    const matchesSearch =
      !term ||
      task.name.toLowerCase().includes(term) ||
      task.details.toLowerCase().includes(term);

    return matchesFilter && matchesSearch;
  });

  // =========================
  // LOADING STATE
  // =========================

  if (projectState.loading) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <RotateCcw className="w-8 h-8 animate-spin mx-auto mb-3" />

            <p className="text-gray-500">
              Loading project...
            </p>
          </div>
        </div>
      </>
    );
  }

  // =========================
  // ERROR STATE
  // =========================

  if (projectState.error) {
    return (
      <>
        <Navbar />

        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-red-500 mb-4">
              {projectState.error}
            </p>

            <button
              type="button"
              onClick={fetchProjectData}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">

          {/* Back Button */}

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-6"
          >
            <ArrowLeft size={18} />

            Back to Dashboard
          </Link>

          {/* Project Header */}

          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {projectState.data?.name}
                </h1>

                <p className="text-gray-500 mt-2">
                  {projectState.data?.details}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setUiState((prev) => ({
                      ...prev,
                      showEditProjectModal: true,
                    }))
                  }
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  <Pencil size={16} />

                  Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setUiState((prev) => ({
                      ...prev,
                      showDeleteProjectDialog: true,
                    }))
                  }
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  <Trash2 size={16} />

                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* Task Stats */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

            {/* Total Tasks */}

            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Circle size={20} />
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Total Tasks
                  </p>

                  <p className="text-2xl font-bold">
                    {taskState.data.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Completed */}

            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <CheckCircle2 size={20} />
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Completed
                  </p>

                  <p className="text-2xl font-bold">
                    {completedTasks}
                  </p>
                </div>
              </div>
            </div>

            {/* In Progress */}

            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Clock3 size={20} />
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    In Progress
                  </p>

                  <p className="text-2xl font-bold">
                    {taskState.data.length - completedTasks}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress */}

          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900">
                Project Progress
              </h2>

              <span className="font-bold">
                {progress}%
              </span>
            </div>

            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-black rounded-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>

          {/* Task Section */}

          <TaskSection
            setUiState={setUiState}
            uiState={uiState}
            taskForm={taskForm}
            setTaskForm={setTaskForm}
            taskState={taskState}
            FILTERS={FILTERS}
            visibleTasks={visibleTasks}
            addTask={addTask}
            toggleTaskStatus={toggleTaskStatus}
            openEditTaskModal={openEditTaskModal}
          />
        </div>
      </main>

      {/* =========================
          EDIT TASK MODAL
      ========================= */}

      {uiState.showEditTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6">

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                Edit Task
              </h2>

              <button
                type="button"
                onClick={closeEditTaskModal}
                className="text-gray-500 hover:text-black"
                aria-label="Close edit task modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={editTask}>
              <div className="space-y-4">

                {/* Task Name */}

                <div>
                  <label
                    htmlFor="edit-task-name"
                    className="block text-sm font-medium mb-2"
                  >
                    Task Name
                  </label>

                  <input
                    id="edit-task-name"
                    type="text"
                    value={taskForm.name}
                    onChange={(e) =>
                      setTaskForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black"
                  />
                </div>

                {/* Task Details */}

                <div>
                  <label
                    htmlFor="edit-task-details"
                    className="block text-sm font-medium mb-2"
                  >
                    Task Details
                  </label>

                  <textarea
                    id="edit-task-details"
                    value={taskForm.details}
                    onChange={(e) =>
                      setTaskForm((prev) => ({
                        ...prev,
                        details: e.target.value,
                      }))
                    }
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black resize-none"
                  />
                </div>
              </div>

              {/* Modal Actions */}

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={closeEditTaskModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={taskState.editing}
                  className="px-4 py-2 bg-black text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition"
                >
                  {taskState.editing
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================
          DELETE PROJECT DIALOG
      ========================= */}

      <ConfirmDialog
        isOpen={uiState.showDeleteProjectDialog}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Delete Project"
        cancelText="Cancel"
        loading={projectState.deleting}
        onConfirm={deleteProject}
        onCancel={() =>
          setUiState((prev) => ({
            ...prev,
            showDeleteProjectDialog: false,
          }))
        }
      />

      {/* =========================
          DELETE TASK DIALOG
      ========================= */}

      <ConfirmDialog
        isOpen={!!uiState.taskToDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${uiState.taskToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete Task"
        cancelText="Cancel"
        loading={taskState.deleting}
        onConfirm={deleteTask}
        onCancel={() =>
          setUiState((prev) => ({
            ...prev,
            taskToDelete: null,
          }))
        }
      />

      {/* =========================
          UPDATE PROJECT MODAL
      ========================= */}

      {uiState.showEditProjectModal && (
        <UpdateProject
          project={projectState.data}
          onClose={() =>
            setUiState((prev) => ({
              ...prev,
              showEditProjectModal: false,
            }))
          }
          onUpdated={(updatedProject) =>
            setProjectState((prev) => ({
              ...prev,
              data: updatedProject,
            }))
          }
          onError={(error) =>
            setProjectState((prev) => ({
              ...prev,
              error,
            }))
          }
        />
      )}
    </>
  );
};

export default ProjectDetails;