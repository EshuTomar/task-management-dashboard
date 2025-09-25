"use client"

import type { Task } from "@/lib/types"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, ArrowRight, ArrowLeft, User } from "lucide-react"
import { useAppDispatch } from "@/lib/hooks"
import { deleteTask, moveTask } from "@/lib/features/tasks/tasksSlice"
import { EditTaskDialog } from "./edit-task-dialog"
import { useState } from "react"

interface TaskCardProps {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const dispatch = useAppDispatch()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isMoving, setIsMoving] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    setTimeout(() => {
      dispatch(deleteTask(task.id))
      setIsDeleting(false)
    }, 300)
  }

  const handleMove = async (newStatus: Task["status"]) => {
    setIsMoving(true)
    setTimeout(() => {
      dispatch(moveTask({ id: task.id, status: newStatus }))
      setIsMoving(false)
    }, 200)
  }

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "High":
        return "bg-red-50 text-red-700 border-red-200"
      case "Medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "Low":
        return "bg-green-50 text-green-700 border-green-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getNextStatus = () => {
    switch (task.status) {
      case "To Do":
        return "In Progress"
      case "In Progress":
        return "Done"
      default:
        return null
    }
  }

  const getPrevStatus = () => {
    switch (task.status) {
      case "Done":
        return "In Progress"
      case "In Progress":
        return "To Do"
      default:
        return null
    }
  }

  return (
    <>
      <Card
        className={`group hover:shadow-md transition-shadow ${isDeleting ? "opacity-50" : ""} ${isMoving ? "scale-105" : ""}`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <h3 className="font-medium text-sm leading-tight">{task.title}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                  disabled={isDeleting || isMoving}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                {getPrevStatus() && (
                  <DropdownMenuItem onClick={() => handleMove(getPrevStatus()!)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Move to {getPrevStatus()}
                  </DropdownMenuItem>
                )}
                {getNextStatus() && (
                  <DropdownMenuItem onClick={() => handleMove(getNextStatus()!)}>
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Move to {getNextStatus()}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? "Deleting..." : "Delete"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>

          <div className="flex items-center justify-between">
            <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>{task.priority}</Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              <span className="truncate max-w-20">{task.assignee}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <EditTaskDialog task={task} open={isEditOpen} onOpenChange={setIsEditOpen} />
    </>
  )
}
