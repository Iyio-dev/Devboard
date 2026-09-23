import Project from "../models/Project.js";
import Task from "../models/Task.js";
import isValidObjectId from "../utils/isValidObjectId.js";

// Helpers: every query includes the user id, so a user can only ever
// read or modify their own documents — even if they guess another
// user's project id.

function getOwnedProjectQuery(projectId, userId) {
  return { _id: projectId, user: userId };
}

export async function getAllProjects(req, res) {
  try {
    const projects = await Project.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: projects,
    });
  } catch (error) {
    console.error("Project listing error:", error);
    return res.status(500).json({
      success: false,
      message: "listing failed",
    });
  }
}

export async function getProjectById(req, res) {
  try {
    const projectId = req.params.id;

    if (!isValidObjectId(projectId)) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const project = await Project.findOne(
      getOwnedProjectQuery(projectId, req.user.id),
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: project,
    });
  } catch (error) {
    console.error("Project fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "listing failed",
    });
  }
}

export async function createProject(req, res) {
  try {
    const { name, details } = req.body;

    if (!name || !details) {
      return res.status(400).json({
        success: false,
        message: "Missing fields required",
      });
    }

    const created = await Project.create({
      name,
      details,
      user: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      result: created,
    });
  } catch (error) {
    console.error("Project creation error:", error);
    return res.status(500).json({
      success: false,
      message: "creation failed",
    });
  }
}

export async function updateProject(req, res) {
  try {
    const projectId = req.params.id;

    if (!isValidObjectId(projectId)) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const { name, details } = req.body;

    if (!name || !details) {
      return res.status(400).json({
        success: false,
        message: "Missing fields required",
      });
    }

    const updatedProject = await Project.findOneAndUpdate(
      getOwnedProjectQuery(projectId, req.user.id),
      { name, details },
      { new: true },
    );

    if (!updatedProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      result: updatedProject,
    });
  } catch (error) {
    console.error("Project update error:", error);
    return res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
}

export async function deleteProject(req, res) {
  try {
    const projectId = req.params.id;

    if (!isValidObjectId(projectId)) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const deleted = await Project.findOneAndDelete(
      getOwnedProjectQuery(projectId, req.user.id),
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Remove the project's tasks so they are not left orphaned in the DB
    // (orphaned tasks would still count towards the dashboard stats).
    await Task.deleteMany({ project: projectId });

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Project delete error:", error);
    return res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
}
