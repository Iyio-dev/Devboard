import React from "react";
import { Circle } from "lucide-react";

import TaskItem from "./TaskItem";

const TaskList = ({
  visibleTasks,
  taskState,
  toggleTaskStatus,
  openEditTaskModal,
  setUiState,
}) => {
  if (visibleTasks.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Circle
            size={40}
            className="mx-auto text-gray-300 mb-3"
          />

          <h3 className="font-semibold text-gray-700">
            No tasks found
          </h3>

          <p className="text-gray-500 text-sm mt-1">
            Try changing your search or filter.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-4">
        {visibleTasks.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            taskState={taskState}
            toggleTaskStatus={toggleTaskStatus}
            openEditTaskModal={openEditTaskModal}
            setUiState={setUiState}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
