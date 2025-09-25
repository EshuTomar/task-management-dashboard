"use client"

import { useAppSelector } from "@/lib/hooks"
import { TaskColumn } from "./task-column"

export function TaskBoard() {
  const { tasks, searchTerm, priorityFilter, assigneeFilter } = useAppSelector((state) => state.tasks)

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesPriority = !priorityFilter || task.priority === priorityFilter
    const matchesAssignee = !assigneeFilter || task.assignee === assigneeFilter

    return matchesSearch && matchesPriority && matchesAssignee
  })

  // Group tasks by status
  const todoTasks = filteredTasks.filter((task) => task.status === "To Do")
  const inProgressTasks = filteredTasks.filter((task) => task.status === "In Progress")
  const doneTasks = filteredTasks.filter((task) => task.status === "Done")

  const hasNoResults = filteredTasks.length === 0 && tasks.length > 0

  if (hasNoResults) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <TaskColumn title="To Do" tasks={todoTasks} status="To Do" className="bg-red-50 dark:bg-red-950/20" />
      <TaskColumn
        title="In Progress"
        tasks={inProgressTasks}
        status="In Progress"
        className="bg-yellow-50 dark:bg-yellow-950/20"
      />
      <TaskColumn title="Done" tasks={doneTasks} status="Done" className="bg-green-50 dark:bg-green-950/20" />
    </div>
  )
}
