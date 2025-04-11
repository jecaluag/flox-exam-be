export const TASK_MESSAGES = {
  SUCCESS: {
    FETCHED: "Tasks fetched successfully",
    CREATED: "Task created successfully",
    DELETED: "Task deleted successfully",
    TOGGLED: "Task status toggled successfully",
  },
  ERROR: {
    FETCH: "Failed to fetch tasks",
    CREATE: "Failed to create task",
    DELETE: "Failed to delete task",
    TOGGLE: "Failed to toggle task",
    NOT_FOUND: "Task not found",
    INVALID_ID: "Invalid task ID",
    VALIDATION: {
      TITLE_REQUIRED: "Title is required and must be a non-empty string",
      INVALID_DESCRIPTION: "Description must be a string",
    },
  },
} as const;
