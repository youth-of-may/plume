"use client"

import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import EditTaskButton from "./edittaskbutton"

type Difficulty = {
  difficulty_name: string
  difficulty_expamount: number
}

type Task = {
  id: number
  task_title: string
  task_details: string
  task_difficulty: string
  task_deadline: string | null
  completion_datetime: string
  is_complete: boolean
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(dateString))
}

function getDeadlineMessage(dateString: string) {
  const diffMs = new Date(dateString).getTime() - Date.now()

  if (diffMs <= 0) return <p style={{ color: "red" }}>Overdue</p>

  const totalMinutes = Math.floor(diffMs / (1000 * 60))
  const days = Math.floor(totalMinutes / (60 * 24))
  const remainingMinutesAfterDays = totalMinutes % (60 * 24)
  const hours = Math.floor(remainingMinutesAfterDays / 60)
  const minutes = remainingMinutesAfterDays % 60

  return (
    <p>
      {days > 0 && `${days}d `}
      {hours > 0 && `${hours}h `}
      {minutes}m left
    </p>
  )
}

type TaskListClientProps = {
  tasks: Task[]
  mode: "pending" | "completed"
  difficulties: Difficulty[]
}

export default function TaskListClient({
  tasks,
  mode,
  difficulties
}: TaskListClientProps) {
  const supabase = createClient()
  const router = useRouter()

  async function updateTaskStatus(id: number, isComplete: boolean) {
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) return

    const { error } = await supabase
      .from("task")
      .update({
        is_complete: isComplete,
        completion_datetime: isComplete ? new Date().toISOString() : null,
      })
      .eq("id", id)
      .eq("user_id", user.id)

    if (error) return
    router.refresh()
  }

    return (
    <ul>
        {tasks.map((task) => (
        <li key={task.id}>
          <div className="flex items-start gap-3 mt-4">
              <input type="checkbox" className="appearance-none w-10 h-10 border-4 border-[#CCC38D] rounded-lg
             checked:bg-[#ADD3EA] checked:border-[#ADD3EA]
             checked:before:content-['✔'] checked:before:text-white
             checked:before:flex checked:before:items-center checked:before:justify-center
             checked:before:text-2xl"
                checked={mode !== "pending"} onChange={(e) => updateTaskStatus(task.id, e.target.checked)}/>
            <div>
              <strong style={{ marginRight: "48px" }}>{task.task_title}</strong>
              {" "}Difficulty: {task.task_difficulty}
              <p>{task.task_details}</p>

              {mode === "pending" && task.task_deadline && (
              <div>
                  <p>Due: {formatDate(task.task_deadline)}</p>
                  {getDeadlineMessage(task.task_deadline)}
              </div>
              )}

              {mode === "completed" && (
                  <p>Date Completed: {formatDate(task.completion_datetime)}</p>
              )}
              {" "}<EditTaskButton task={task} difficulties={difficulties} />
            </div>
          </div>
          <hr className="block my-6 w-9/10 border-t-2 border-[#CCC38D] rounded-lg"/>
        </li>
        ))}
    </ul>
    )
}
