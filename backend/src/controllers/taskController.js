import Project from "../models/Project.js";
import Task from "../models/Task.js";
import isValidObjectId from "../utils/isValidObjectId.js";
import asyncHandler from "../utils/asyncHandler.js";
import Activity from "../models/Activity.js";
import { getPagination, buildPaginationMeta } from "../utils/paginate.js";

export const getAllTasks = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { user: req.user.id };

  const [tasks, total] = await Promise.all([
    Task.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Task.countDocuments(filter),
  ]);

  return res.status(200).json({
    success: true,
    message: tasks,
    pagination: buildPaginationMeta(page, limit, total),
  });
});

export const getAllProjectTasks = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return next({
      status: 404,
      message: "Project not found",
    });
  }

  const { page, limit, skip } = getPagination(req.query);
  const filter = { user: req.user.id, project: id };

  const [tasks, total] = await Promise.all([
    Task.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Task.countDocuments(filter),
  ]);

  return res.status(200).json({
    success: true,
    message: tasks,
    pagination: buildPaginationMeta(page, limit, total),
  });
});

export const getTaskById = asyncHandler(async (req, res, next) => {
  const taskId = req.params.id;

  if (!isValidObjectId(taskId)) {
    return next({
      status: 404,
      message: "Task not found",
    });
  }

  const task = await Task.findOne({
    _id: taskId,
    user: req.user.id,
  });

  if (!task) {
    return next({
      status: 404,
      message: "Task not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: task,
  });
});

export const createTask = asyncHandler(async (req, res, next) => {
  const projectId = req.params.id;

  if (!isValidObjectId(projectId)) {
    return next({
      status: 404,
      message: "Project not found",
    });
  }

  // The task must belong to a project the user owns
  const project = await Project.findOne({
    _id: projectId,
    user: req.user.id,
  });

  if (!project) {
    return next({
      status: 404,
      message: "Project not found",
    });
  }

  const { name, details } = req.body;

  if (!name || !details) {
    return next({
      status: 400,
      message: "Missing fields required",
    });
  }

  const created = await Task.create({
    name,
    details,
    user: req.user._id,
    status: "in-progress",
    project: projectId,
  });

  await Activity.create({
    user: req.user._id,
    project: created.project,
    task: created._id,
    type: "task_created",
    message: `Created task "${created.name}"`,
  });

  return res.status(201).json({
    success: true,
    message: "Task created successfully",
    result: created,
  });
});

export const updateTask = asyncHandler(async (req, res, next) => {
  const taskId = req.params.id;

  if (!isValidObjectId(taskId)) {
    return next({
      status: 404,
      message: "Task not found",
    });
  }

  const { name, details } = req.body;

  if (!name || !details) {
    return next({
      status: 400,
      message: "Missing fields required",
    });
  }

  const updatedTask = await Task.findOneAndUpdate(
    {
      _id: taskId,
      user: req.user.id,
    },
    { name, details },
    { new: true },
  );

  if (!updatedTask) {
    return next({
      status: 404,
      message: "Task not found",
    });
  }

  await Activity.create({
    user: req.user._id,
    project: updatedTask.project,
    task: updatedTask._id,
    type: "task_updated",
    message: `Updated task "${updatedTask.name}"`,
  });

  return res.status(200).json({
    success: true,
    message: "Task updated successfully",
    result: updatedTask,
  });
});

export const deleteTask = asyncHandler(async (req, res, next) => {
  const taskId = req.params.id;

  if (!isValidObjectId(taskId)) {
    return next({
      status: 404,
      message: "Task not found",
    });
  }

  const deleted = await Task.findOneAndDelete({
    _id: taskId,
    user: req.user.id,
  });

  if (!deleted) {
    return next({
      status: 404,
      message: "Task not found",
    });
  }

  await Activity.create({
    user: req.user._id,
    project: deleted.project,
    task: deleted._id,
    type: "task_deleted",
    message: `Deleted task "${deleted.name}"`,
  });

  return res.status(200).json({
    success: true,
    message: "Task deleted successfully",
  });
});

export const completeTask = asyncHandler(async (req, res, next) => {
  const taskId = req.params.id;

  if (!isValidObjectId(taskId)) {
    return next({
      status: 404,
      message: "Task not found",
    });
  }

  const task = await Task.findOne({
    _id: taskId,
    user: req.user.id,
  });

  if (!task) {
    return next({
      status: 404,
      message: "Task not found",
    });
  }

  const status = task.status === "completed" ? "in-progress" : "completed";

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    { status },
    { new: true },
  );

  task.status === "in-progress"
    ? await Activity.create({
        user: req.user._id,
        project: updatedTask.project,
        task: updatedTask._id,
        type: "task_completed",
        message: `Completed task "${updatedTask.name}"`,
      })
    : await Activity.create({
        user: req.user._id,
        project: updatedTask.project,
        task: updatedTask._id,
        type: "task_reopened",
        message: `Reopened task "${updatedTask.name}"`,
      });

  return res.status(200).json({
    success: true,
    message: "Task status updated successfully",
    result: updatedTask,
  });
});
