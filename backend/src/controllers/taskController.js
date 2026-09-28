import Project from "../models/Project.js";
import Task from "../models/Task.js";
import isValidObjectId from "../utils/isValidObjectId.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getPagination, buildPaginationMeta } from "../utils/paginate.js";

// Every query includes the user id, so a user can only ever read or
// modify their own tasks — even if they guess another user's task id.

export const getAllTasks = asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query);
    const filter = { user: req.user.id };

    const [tasks, total] = await Promise.all([
        Task.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
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
        Task.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
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
        user: req.user.id,
        status: "in-progress",
        project: projectId,
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

    const status =
        task.status === "completed"
            ? "in-progress"
            : "completed";

    const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        { status },
        { new: true },
    );

    return res.status(200).json({
        success: true,
        message: "Task status updated successfully",
        result: updatedTask,
    });
});
