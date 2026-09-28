import React from "react";
import TaskHeader from "./TaskHeader";
import TaskForm from "./TaskForm";
import TaskFilters from "./TaskFilters";
import TaskList from "./TaskList";

const TaskSection = ({
  setUiState,
  uiState,
  taskForm,
  setTaskForm,
  taskState,
  FILTERS,
  visibleTasks,
  addTask,
  toggleTaskStatus,
  openEditTaskModal,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl">
      <TaskHeader
        uiState={uiState}
        setUiState={setUiState}
      />

      {uiState.showAddTaskForm && (
        <TaskForm
          taskForm={taskForm}
          setTaskForm={setTaskForm}
          taskState={taskState}
          addTask={addTask}
          setUiState={setUiState}
        />
      )}

      <TaskFilters
        uiState={uiState}
        setUiState={setUiState}
        FILTERS={FILTERS}
      />

      <TaskList
        visibleTasks={visibleTasks}
        taskState={taskState}
        toggleTaskStatus={toggleTaskStatus}
        openEditTaskModal={openEditTaskModal}
        setUiState={setUiState}
      />
    </div>
  );
};

export default TaskSection;