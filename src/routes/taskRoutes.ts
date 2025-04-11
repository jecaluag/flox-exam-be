import { Router, Request, Response } from "express";
import {
  getAllTasks,
  createTask,
  toggleTask,
  deleteTask,
} from "../db/database";
import { CreateTaskDTO, Task } from "../models/Task";
import { TASK_MESSAGES } from "../constants/messages";

const router = Router();

interface ApiResponse<T = void> {
  success: boolean;
  message?: string;
  data?: T;
}

type Handler<P = {}, ResBody = any, ReqBody = any> = (
  req: Request<P, ResBody, ReqBody>,
  res: Response<ResBody>
) => void;

// GET /api/tasks - Get all tasks
const getTasks: Handler<{}, ApiResponse<Task[]>> = (_req, res) => {
  try {
    const tasks = getAllTasks();
    res.json({
      success: true,
      data: tasks as Task[],
      message: TASK_MESSAGES.SUCCESS.FETCHED,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: TASK_MESSAGES.ERROR.FETCH,
    });
  }
};

// POST /api/tasks - Create a new task
const createNewTask: Handler<{}, ApiResponse<Task>, CreateTaskDTO> = (
  req,
  res
) => {
  try {
    const { title, description } = req.body;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: TASK_MESSAGES.ERROR.VALIDATION.TITLE_REQUIRED,
      });
    }

    if (description !== undefined && typeof description !== "string") {
      return res.status(400).json({
        success: false,
        message: TASK_MESSAGES.ERROR.VALIDATION.INVALID_DESCRIPTION,
      });
    }

    const task = createTask(title.trim(), description?.trim());
    res.status(201).json({
      success: true,
      data: task as Task,
      message: TASK_MESSAGES.SUCCESS.CREATED,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: TASK_MESSAGES.ERROR.CREATE,
    });
  }
};

// PATCH /api/tasks/:id/toggle - Toggle task completion
const toggleTaskStatus: Handler<{ id: string }, ApiResponse<Task>> = (
  req,
  res
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: TASK_MESSAGES.ERROR.INVALID_ID,
      });
    }

    const task = toggleTask(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: TASK_MESSAGES.ERROR.NOT_FOUND,
      });
    }

    res.json({
      success: true,
      data: task as Task,
      message: TASK_MESSAGES.SUCCESS.TOGGLED,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: TASK_MESSAGES.ERROR.TOGGLE,
    });
  }
};

// DELETE /api/tasks/:id - Delete a task
const deleteTaskById: Handler<{ id: string }, ApiResponse> = (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: TASK_MESSAGES.ERROR.INVALID_ID,
      });
    }

    const deleted = deleteTask(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: TASK_MESSAGES.ERROR.NOT_FOUND,
      });
    }

    res.json({
      success: true,
      message: TASK_MESSAGES.SUCCESS.DELETED,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: TASK_MESSAGES.ERROR.DELETE,
    });
  }
};

router.get("/", getTasks);
router.post("/", createNewTask);
router.patch("/:id/toggle", toggleTaskStatus);
router.delete("/:id", deleteTaskById);

export const taskRoutes = router;
