export interface Task {
  title: string
  description: string
  status: TaskStatus
}

export type TaskStatus = 'Todo' | 'In Progress' | 'Completed'