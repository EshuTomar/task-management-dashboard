import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Task, TaskState } from "../../types"
import { localStorage as storage } from "../../utils/localStorage"

// Load tasks from localStorage or JSON
export const loadTasks = createAsyncThunk("tasks/loadTasks", async () => {
  // First try to load from localStorage
  const savedTasks = storage.getTasks()
  if (savedTasks && savedTasks.length > 0) {
    return savedTasks as Task[]
  }

  // If no saved tasks, load from JSON file
  const response = await fetch("/tasks.json")
  if (!response.ok) {
    throw new Error("Failed to load tasks")
  }
  const tasks = await response.json()
  return tasks as Task[]
})

export const loadFilters = createAsyncThunk("tasks/loadFilters", async () => {
  const savedFilters = storage.getFilters()
  return (
    savedFilters || {
      searchTerm: "",
      priorityFilter: "",
      assigneeFilter: "",
    }
  )
})

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  searchTerm: "",
  priorityFilter: "",
  assigneeFilter: "",
}

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<Task, "id">>) => {
      const newTask: Task = {
        ...action.payload,
        id: Math.max(...state.tasks.map((t) => t.id), 0) + 1,
      }
      state.tasks.push(newTask)
      storage.setTasks(state.tasks)
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex((task) => task.id === action.payload.id)
      if (index !== -1) {
        state.tasks[index] = action.payload
        storage.setTasks(state.tasks)
      }
    },
    deleteTask: (state, action: PayloadAction<number>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload)
      storage.setTasks(state.tasks)
    },
    moveTask: (state, action: PayloadAction<{ id: number; status: Task["status"] }>) => {
      const task = state.tasks.find((t) => t.id === action.payload.id)
      if (task) {
        task.status = action.payload.status
        storage.setTasks(state.tasks)
      }
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
      storage.setFilters({
        searchTerm: action.payload,
        priorityFilter: state.priorityFilter,
        assigneeFilter: state.assigneeFilter,
      })
    },
    setPriorityFilter: (state, action: PayloadAction<string>) => {
      state.priorityFilter = action.payload
      storage.setFilters({
        searchTerm: state.searchTerm,
        priorityFilter: action.payload,
        assigneeFilter: state.assigneeFilter,
      })
    },
    setAssigneeFilter: (state, action: PayloadAction<string>) => {
      state.assigneeFilter = action.payload
      storage.setFilters({
        searchTerm: state.searchTerm,
        priorityFilter: state.priorityFilter,
        assigneeFilter: action.payload,
      })
    },
    clearAllData: (state) => {
      state.tasks = []
      state.searchTerm = ""
      state.priorityFilter = ""
      state.assigneeFilter = ""
      storage.clear()
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTasks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadTasks.fulfilled, (state, action) => {
        state.loading = false
        state.tasks = action.payload
        storage.setTasks(action.payload)
      })
      .addCase(loadTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to load tasks"
      })
      .addCase(loadFilters.fulfilled, (state, action) => {
        state.searchTerm = action.payload.searchTerm
        state.priorityFilter = action.payload.priorityFilter
        state.assigneeFilter = action.payload.assigneeFilter
      })
  },
})

export const {
  addTask,
  updateTask,
  deleteTask,
  moveTask,
  setSearchTerm,
  setPriorityFilter,
  setAssigneeFilter,
  clearAllData,
} = tasksSlice.actions

export default tasksSlice.reducer
