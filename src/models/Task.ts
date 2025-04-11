export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
}
