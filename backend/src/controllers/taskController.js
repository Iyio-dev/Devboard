import Project from "../models/Project.js";
import Task from "../models/Task.js";
import isValidObjectId from "../utils/isValidObjectId.js";

// Every query includes the user id, so a user can only ever read or
// modify their own tasks — even if they guess another user's task id.

export async function getAllTasks(req, res) {
  try {
    const tasks = await Task.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: tasks,
    });
  } catch (error) {
    console.error("Task listing error:", error);
    return res.status(500).json({
      success: false,
      message: "listing failed",
    });
  }
}

export async function getAllProjectTasks(req, res) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(200).json({ success: true, message: [] });
    }

    const tasks = await Task.find({ user: req.user.id, project: id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: tasks,
    });
  } catch (error) {
    console.error("Project tasks listing error:", error);
    return res.status(500).json({
      success: false,
      message: "listing failed",
    });
  }
}

export async function getTaskById(req, res) {
  try {
    const taskId = req.params.id;

    if (!isValidObjectId(taskId)) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const task = await Task.findOne({ _id: taskId, user: req.user.id });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: task,
    });
  } catch (error) {
    console.error("Task fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "listing failed",
    });
  }
}

export async function createTask(req, res) {
  try {
    const projectId = req.params.id;

    if (!isValidObjectId(projectId)) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // The task must belong to a project the user owns
    const project = await Project.findOne({
      _id: projectId,
      user: req.user.id,
    });

    if (!project) {
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
  } catch (error) {
    console.error("Task creation error:", error);
    return res.status(500).json({
      success: false,
      message: "creation failed",
    });
  }
}

export async function updateTask(req, res) {
  try {
    const taskId = req.params.id;

    if (!isValidObjectId(taskId)) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const { name, details } = req.body;

    if (!name || !details) {
      return res.status(400).json({
        success: false,
        message: "Missing fields required",
      });
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, user: req.user.id },
      { name, details },
      { new: true },
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      result: updatedTask,
    });
  } catch (error) {
    console.error("Task update error:", error);
    return res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
}

export async function deleteTask(req, res) {
  try {
    const taskId = req.params.id;

    if (!isValidObjectId(taskId)) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const deleted = await Task.findOneAndDelete({
      _id: taskId,
      user: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Task delete error:", error);
    return res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
}

export async function completeTask(req, res) {
  try {
    const taskId = req.params.id;

    if (!isValidObjectId(taskId)) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const task = await Task.findOne({ _id: taskId, user: req.user.id });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Toggle: completed tasks go back to in-progress, in-progress tasks complete
    const status = task.status === "completed" ? "in-progress" : "completed";

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
  } catch (error) {
    console.error("Task status update error:", error);
    return res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
}
