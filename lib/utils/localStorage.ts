export const STORAGE_KEYS = {
  TASKS: "tasks",
  FILTERS: "task-filters",
} as const

export interface StoredFilters {
  searchTerm: string
  priorityFilter: string
  assigneeFilter: string
}

export const localStorage = {
  // Tasks operations
  getTasks: (): any[] | null => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEYS.TASKS)
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.error("Error reading tasks from localStorage:", error)
      return null
    }
  },

  setTasks: (tasks: any[]): void => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks))
    } catch (error) {
      console.error("Error saving tasks to localStorage:", error)
    }
  },

  // Filter preferences operations
  getFilters: (): StoredFilters | null => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEYS.FILTERS)
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.error("Error reading filters from localStorage:", error)
      return null
    }
  },

  setFilters: (filters: StoredFilters): void => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.FILTERS, JSON.stringify(filters))
    } catch (error) {
      console.error("Error saving filters to localStorage:", error)
    }
  },

  // Clear all data
  clear: (): void => {
    try {
      window.localStorage.removeItem(STORAGE_KEYS.TASKS)
      window.localStorage.removeItem(STORAGE_KEYS.FILTERS)
    } catch (error) {
      console.error("Error clearing localStorage:", error)
    }
  },
}
