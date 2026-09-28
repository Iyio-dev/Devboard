import React from "react";

const TaskForm = ({
  taskForm,
  setTaskForm,
  taskState,
  addTask,
  setUiState,
}) => {
  const handleCancel = () => {
    setUiState((prev) => ({
      ...prev,
      showAddTaskForm: false,
    }));
  };

  return (
    <form
      onSubmit={addTask}
      className="mx-6 mt-6 mb-6 p-5 bg-gray-50 rounded-xl border border-gray-200"
    >
      <div className="grid gap-4">
        {/* Task Name */}
        <div>
          <label
            htmlFor="task-name"
            className="block text-sm font-medium mb-2"
          >
            Task Name
          </label>

          <input
            id="task-name"
            type="text"
            value={taskForm.name}
            onChange={(e) =>
              setTaskForm((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            placeholder="Enter task name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black"
          />
        </div>

        {/* Task Details */}
        <div>
          <label
            htmlFor="task-details"
            className="block text-sm font-medium mb-2"
          >
            Task Details
          </label>

          <textarea
            id="task-details"
            value={taskForm.details}
            onChange={(e) =>
              setTaskForm((prev) => ({
                ...prev,
                details: e.target.value,
              }))
            }
            placeholder="Enter task details"
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={taskState.adding}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {taskState.adding ? "Creating..." : "Create Task"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default TaskForm;
