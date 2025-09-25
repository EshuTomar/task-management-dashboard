export interface Task {
  id: number
  title: string
  description: string
  priority: "High" | "Medium" | "Low"
  assignee: string
  status: "To Do" | "In Progress" | "Done"
}

export interface TaskState {
  tasks: Task[]
  loading: boolean
  error: string | null
  searchTerm: string
  priorityFilter: string
  assigneeFilter: string
}
