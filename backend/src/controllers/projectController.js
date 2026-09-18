import Project from "../models/Project.js";

export async function getAllProjects(req, res) {
  try {
    const userId = req.user.id;
    const query = { user: userId };
    const projects = await Project.find(query).sort({ ceratedAt: -1 }).lean();

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
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this project",
      });
    }

    return res.status(200).json({
      success: true,
      message: project,
    });

  } catch (error) {
    console.error("Project listing error:", error);
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

    const payload = {
      name,
      details,
      user: req.user.id,
    };

    const created = await Project.create(payload);

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
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this project",
      });
    }

    const { name, details } = req.body;

    if (!name || !details) {
      return res.status(400).json({
        success: false,
        message: "Missing fields required",
      });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { name, details },
      { new: true },
    );

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
    try{
    const projectId = req.params.id;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this project",
      });
    }

    await Project.findByIdAndDelete(projectId);

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
