import { Task, TaskStatus } from './task'

export interface AppState {
  tasks: Task[]
  filterCriteria: {
    searchTerm: string
    status?: TaskStatus
  }
}
