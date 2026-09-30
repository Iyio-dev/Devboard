import Project from "../models/Project.js";
import Task from "../models/Task.js";
import isValidObjectId from "../utils/isValidObjectId.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getPagination, buildPaginationMeta } from "../utils/paginate.js";

function getOwnedProjectQuery(projectId, userId) {
    return { _id: projectId, user: userId };
}

export const getAllProjects = asyncHandler(async (req, res) => {
    const { page, limit, skip } = getPagination(req.query);
    const filter = { user: req.user.id };

    const [projects, total] = await Promise.all([
        Project.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Project.countDocuments(filter),
    ]);

    return res.status(200).json({
        success: true,
        message: projects,
        pagination: buildPaginationMeta(page, limit, total),
    });
});

export const getProjectById = asyncHandler(async (req, res, next) => {
    const projectId = req.params.id;

    if (!isValidObjectId(projectId)) {
        return next({
            status: 404,
            message: "Project not found",
        });
    }

    const project = await Project.findOne(
        getOwnedProjectQuery(projectId, req.user.id),
    );

    if (!project) {
        return next({
            status: 404,
            message: "Project not found",
        });
    }

    return res.status(200).json({
        success: true,
        message: project,
    });
});

export const createProject = asyncHandler(async (req, res) => {
    const { name, details } = req.body;

    const created = await Project.create({
        name,
        details,
        user: req.user.id,
    });

    await Activity.create({
        user: req.user._id,
        project: created._id,
        task: null,
        type: "project_created",
        message: `Created project "${created.name}"`,
      });

    return res.status(201).json({
        success: true,
        message: "Project created successfully",
        result: created,
    });
});

export const updateProject = asyncHandler(async (req, res, next) => {
    const projectId = req.params.id;

    if (!isValidObjectId(projectId)) {
        return next({
            status: 404,
            message: "Project not found",
        });
    }

    const { name, details } = req.body;

    const updatedProject = await Project.findOneAndUpdate(
        getOwnedProjectQuery(projectId, req.user.id),
        { name, details },
        { new: true },
    );

    if (!updatedProject) {
        return next({
            status: 404,
            message: "Project not found",
        });
    }

    await Activity.create({
        user: req.user._id,
        project: updatedProject._id,
        task: null,
        type: "project_updated",
        message: `Updated project "${updatedProject.name}"`,
      });

    return res.status(200).json({
        success: true,
        message: "Project updated successfully",
        result: updatedProject,
    });
});

export const deleteProject = asyncHandler(async (req, res, next) => {
    const projectId = req.params.id;

    if (!isValidObjectId(projectId)) {
        return next({
            status: 404,
            message: "Project not found",
        });
    }

    const deleted = await Project.findOneAndDelete(
        getOwnedProjectQuery(projectId, req.user.id),
    );

    if (!deleted) {
        return next({
            status: 404,
            message: "Project not found",
        });
    }
    await Task.deleteMany({ project: projectId });

    await Activity.create({
        user: req.user._id,
        project: deleted._id,
        task: null,
        type: "project_deleted",
        message: `Deleted project "${deleted.name}"`,
      });

    return res.status(200).json({
        success: true,
        message: "Project deleted successfully",
    });
});
