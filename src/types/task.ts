export enum TaskStatus {
  Todo = 'Todo',
  InProgress = 'In Progress',
  Completed = 'Completed',
}

export interface Task {
  id: number | null
  title: string
  description?: string
  status: TaskStatus
}

export interface FilterCriteria {
  searchTerm: string
  status?: string
}

export interface Option {
  value: string
  label: string
}

export const STATUS_OPTIONS: Option[] = Object.values(TaskStatus).map(status => ({ label: status, value: status }))