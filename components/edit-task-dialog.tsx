"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { updateTask } from "@/lib/features/tasks/tasksSlice"
import type { Task } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface TaskFormData {
  title: string
  description: string
  priority: Task["priority"]
  assignee: string
  status: Task["status"]
}

interface EditTaskDialogProps {
  task: Task
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditTaskDialog({ task, open, onOpenChange }: EditTaskDialogProps) {
  const dispatch = useAppDispatch()
  const { tasks } = useAppSelector((state) => state.tasks)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>()

  // Get unique assignees for suggestions
  const uniqueAssignees = Array.from(new Set(tasks.map((t) => t.assignee)))

  // Reset form when task changes or dialog opens
  useEffect(() => {
    if (open && task) {
      reset({
        title: task.title,
        description: task.description,
        priority: task.priority,
        assignee: task.assignee,
        status: task.status,
      })
    }
  }, [task, open, reset])

  const onSubmit = async (data: TaskFormData) => {
    try {
      dispatch(updateTask({ ...task, ...data }))
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to update task:", error)
    }
  }

  const priority = watch("priority")
  const status = watch("status")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title *</Label>
            <Input
              id="edit-title"
              {...register("title", {
                required: "Title is required",
                minLength: { value: 3, message: "Title must be at least 3 characters" },
              })}
              placeholder="Enter task title"
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description *</Label>
            <Textarea
              id="edit-description"
              {...register("description", {
                required: "Description is required",
                minLength: { value: 10, message: "Description must be at least 10 characters" },
              })}
              placeholder="Enter task description"
              rows={3}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority *</Label>
              <Select value={priority} onValueChange={(value: Task["priority"]) => setValue("priority", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status *</Label>
              <Select value={status} onValueChange={(value: Task["status"]) => setValue("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-assignee">Assignee *</Label>
            <Input
              id="edit-assignee"
              {...register("assignee", {
                required: "Assignee is required",
                minLength: { value: 2, message: "Assignee name must be at least 2 characters" },
              })}
              placeholder="Enter assignee name"
              list="edit-assignees"
            />
            <datalist id="edit-assignees">
              {uniqueAssignees.map((assignee) => (
                <option key={assignee} value={assignee} />
              ))}
            </datalist>
            {errors.assignee && <p className="text-sm text-destructive">{errors.assignee.message}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
