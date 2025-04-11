import Database from "better-sqlite3";

interface TaskRecord {
  id: number;
  title: string;
  description: string | null;
  completed: number;
  created_at: string;
}

const db = new Database("db.sqlite");

export function setupDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      completed INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert dummy data if table is empty
  const count = db.prepare("SELECT COUNT(*) as count FROM tasks").get() as {
    count: number;
  };

  if (count.count === 0) {
    const stmt = db.prepare(
      "INSERT INTO tasks (title, description, completed) VALUES (?, ?, ?)"
    );

    stmt.run("Do the dishes", "", 0);

    stmt.run(
      "Prepare for the interview",
      "Review the topics covered in the interview",
      1
    );

    stmt.run("Buy groceries", "Buy groceries for the week", 0);
  }
}

export function getAllTasks() {
  const tasks = db
    .prepare("SELECT * FROM tasks ORDER BY created_at DESC")
    .all() as TaskRecord[];
  return tasks.map((task) => ({
    ...task,
    completed: Boolean(task.completed),
  }));
}

export function createTask(title: string, description?: string) {
  const stmt = db.prepare(
    "INSERT INTO tasks (title, description, completed) VALUES (?, ?, 0)"
  );
  const result = stmt.run(title, description || null);
  const task = db
    .prepare("SELECT * FROM tasks WHERE id = ?")
    .get(result.lastInsertRowid) as TaskRecord;

  return {
    ...task,
    completed: Boolean(task.completed),
  };
}

export function toggleTask(id: number) {
  const stmt = db.prepare(`
    UPDATE tasks
    SET completed = CASE WHEN completed = 0 THEN 1 ELSE 0 END
    WHERE id = ?
    RETURNING *
  `);
  const task = stmt.get(id) as TaskRecord | undefined;
  if (task) {
    return {
      ...task,
      completed: Boolean(task.completed),
    };
  }
  return null;
}

export function deleteTask(id: number): boolean {
  const stmt = db.prepare("DELETE FROM tasks WHERE id = ?");
  const result = stmt.run(id);
  return result.changes > 0;
}
