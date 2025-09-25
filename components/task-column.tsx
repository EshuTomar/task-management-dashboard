"use client"

import type { Task } from "@/lib/types"
import { TaskCard } from "./task-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Plus, CheckCircle, Clock, AlertCircle } from "lucide-react"

interface TaskColumnProps {
  title: string
  tasks: Task[]
  status: Task["status"]
  className?: string
}

export function TaskColumn({ title, tasks, status, className }: TaskColumnProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "To Do":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "In Progress":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "Done":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  const getColumnGradient = () => {
    switch (status) {
      case "To Do":
        return "bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/20 dark:to-red-900/10"
      case "In Progress":
        return "bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-950/20 dark:to-yellow-900/10"
      case "Done":
        return "bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10"
      default:
        return ""
    }
  }

  return (
    <Card className={cn("h-fit border-2 transition-all duration-200", getColumnGradient(), className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs font-medium">
            {tasks.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
              <Plus className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium">No tasks yet</p>
            <p className="text-xs mt-1">Tasks will appear here when added</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task, index) => (
              <div
                key={task.id}
                className="animate-in slide-in-from-top-2 duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TaskCard task={task} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
