export interface Subtask {
    id: string;
    text: string;
    completed: boolean;
}

export interface Task {
    id: string;
    text: string;
    completed: boolean;
    createdAt: number;
    deadline?: number; // Optional deadline timestamp
    completedAt?: number; // Timestamp when task was completed
    description?: string;
    subtasks?: Subtask[];
}
