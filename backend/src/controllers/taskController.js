import Project from "../models/Project.js";
import Task from "../models/Task.js";

export async function getAllTasks(req, res) {
  try {
    const userId = req.user.id;
    const query = { user: userId };
    const tasks = await Task.find(query).sort({ createdAt: -1 }).lean();

    return res.status(200).json({
      success: true,
      message: tasks,
    });

  } catch (error) {
    console.error("Project listing error:", error);
    return res.status(500).json({
      success: false,
      message: "listing failed",
    });
  }
}

export async function getAllProjectTasks(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const query = { user: userId, project: id };
    const tasks = await Task.find(query).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: tasks,
    });

  } catch (error) {
    console.error("Project listing error:", error);
    return res.status(500).json({
      success: false,
      message: "listing failed",
    });
  }
}

export async function getTaskById(req, res) {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this task",
      });
    }

    return res.status(200).json({
      success: true,
      message: task,
    });
  } catch (error) {
    console.error("task listing error:", error);
    return res.status(500).json({
      success: false,
      message: "listing failed",
    });
  }
}

export async function createTask(req, res) {
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

    const payload = {
      name,
      details,
      user: req.user.id,
      status: "in-progress",
      project: projectId,
    };

    const created = await Task.create(payload);

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
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "task not found",
      });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this task",
      });
    }

    const { name, details } = req.body;

    if (!name || !details) {
      return res.status(400).json({
        success: false,
        message: "Missing fields required",
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { name, details },
      { new: true },
    );

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
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "task not found",
      });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this task",
      });
    }

    await Task.findByIdAndDelete(taskId);

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
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "task not found",
      });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this task",
      });
    }

    const status = "completed";

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
