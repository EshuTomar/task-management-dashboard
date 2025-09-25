"use client"

import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { setSearchTerm, setPriorityFilter, setAssigneeFilter } from "@/lib/features/tasks/tasksSlice"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, X, Filter } from "lucide-react"

export function TaskFilters() {
  const dispatch = useAppDispatch()
  const { tasks, searchTerm, priorityFilter, assigneeFilter } = useAppSelector((state) => state.tasks)

  const uniqueAssignees = Array.from(new Set(tasks.map((task) => task.assignee))).sort()

  const handleClearFilters = () => {
    dispatch(setSearchTerm(""))
    dispatch(setPriorityFilter(""))
    dispatch(setAssigneeFilter(""))
  }

  const hasActiveFilters = searchTerm || priorityFilter || assigneeFilter

  const handlePriorityChange = (value: string) => {
    dispatch(setPriorityFilter(value === "all" ? "" : value))
  }

  const handleAssigneeChange = (value: string) => {
    dispatch(setAssigneeFilter(value === "all" ? "" : value))
  }

  const getFilteredTaskCount = () => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignee.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesPriority = !priorityFilter || task.priority === priorityFilter
      const matchesAssignee = !assigneeFilter || task.assignee === assigneeFilter

      return matchesSearch && matchesPriority && matchesAssignee
    }).length
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={priorityFilter || "all"} onValueChange={handlePriorityChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={assigneeFilter || "all"} onValueChange={handleAssigneeChange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {uniqueAssignees.map((assignee) => (
                <SelectItem key={assignee} value={assignee}>
                  {assignee}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={handleClearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>
            {getFilteredTaskCount()} of {tasks.length} tasks
          </span>
          <div className="flex gap-1">
            {searchTerm && (
              <Badge variant="secondary" className="text-xs">
                "{searchTerm}"
              </Badge>
            )}
            {priorityFilter && (
              <Badge variant="secondary" className="text-xs">
                {priorityFilter}
              </Badge>
            )}
            {assigneeFilter && (
              <Badge variant="secondary" className="text-xs">
                {assigneeFilter}
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
