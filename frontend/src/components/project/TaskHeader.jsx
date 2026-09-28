import React from "react";
import { Plus } from "lucide-react";

const TaskHeader = ({ uiState, setUiState }) => {
  const toggleAddTaskForm = () => {
    setUiState((prev) => ({
      ...prev,
      showAddTaskForm: !prev.showAddTaskForm,
    }));
  };

  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Tasks</h2>

          <p className="text-gray-500 text-sm mt-1">
            Manage the tasks for this project.
          </p>
        </div>

        <button
          type="button"
          onClick={toggleAddTaskForm}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          <Plus size={18} />

          Add Task
        </button>
      </div>
    </div>
  );
};

export default TaskHeader;
