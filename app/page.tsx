"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { loadTasks, loadFilters } from "@/lib/features/tasks/tasksSlice"
import { TaskBoard } from "@/components/task-board"
import { TaskFilters } from "@/components/task-filters"
import { AddTaskDialog } from "@/components/add-task-dialog"
import { TaskBoardSkeleton } from "@/components/loading-skeleton"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  const dispatch = useAppDispatch()
  const { loading, error, tasks } = useAppSelector((state) => state.tasks)

  useEffect(() => {
    dispatch(loadTasks())
    dispatch(loadFilters())
  }, [dispatch])

  const handleRetry = () => {
    dispatch(loadTasks())
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Task Management Dashboard</h1>
                <p className="text-muted-foreground mt-1">Loading your tasks...</p>
              </div>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <TaskBoardSkeleton />
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={handleRetry} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Task Management Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Organize and track your team's progress • {tasks.length} tasks
              </p>
            </div>
            <AddTaskDialog />
          </div>
          <div className="mt-6">
            <TaskFilters />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <TaskBoard />
      </main>
    </div>
  )
}
