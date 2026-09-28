import React from "react";
import {
  Circle,
  Trash2,
  Pencil,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";

const TaskItem = ({
  task,
  taskState,
  toggleTaskStatus,
  openEditTaskModal,
  setUiState,
}) => {
  const isCompleted = task.status === "completed";

  const handleDelete = () => {
    setUiState((prev) => ({
      ...prev,
      taskToDelete: task,
    }));
  };

  return (
    <div className="border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition">
      <div className="flex items-start gap-4">
        {/* Status */}
        <button
          type="button"
          onClick={() => toggleTaskStatus(task._id)}
          disabled={taskState.updatingStatus}
          aria-label={
            isCompleted
              ? "Mark task as in progress"
              : "Mark task as completed"
          }
          className="mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCompleted ? (
            <CheckCircle2
              size={24}
              className="text-green-500"
            />
          ) : (
            <Circle
              size={24}
              className="text-gray-400"
            />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold ${
              isCompleted
                ? "line-through text-gray-400"
                : "text-gray-900"
            }`}
          >
            {task.name}
          </h3>

          {task.details && (
            <p
              className={`text-sm mt-1 ${
                isCompleted
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              {task.details}
            </p>
          )}

          {/* Date */}
          <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
            <CalendarDays size={14} />

            <span>
              {task.createdAt
                ? new Date(task.createdAt).toLocaleDateString()
                : "No date"}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Edit */}
          <button
            type="button"
            onClick={() => openEditTaskModal(task)}
            aria-label={`Edit ${task.name}`}
            className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition"
          >
            <Pencil size={17} />
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={handleDelete}
            aria-label={`Delete ${task.name}`}
            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
