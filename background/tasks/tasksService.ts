import fs from "fs"
import path from "path"

export interface Task {
  id: string
  title: string
  prompt: string
  schedule: string
  completed: boolean
  createdAt: string
}

const DATA_FILE = path.resolve(process.cwd(), "tasks.json")

function loadTasks(): Task[] {
  if (!fs.existsSync(DATA_FILE)) {
    return []
  }
  const raw = fs.readFileSync(DATA_FILE, "utf-8")
  return JSON.parse(raw)
}

function saveTasks(tasks: Task[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2))
}

export class TaskService {
  private tasks: Task[]

  constructor() {
    this.tasks = loadTasks()
  }

  list(): Task[] {
    return this.tasks
  }

  add(title: string, prompt: string, schedule: string): Task {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      prompt,
      schedule,
      completed: false,
      createdAt: new Date().toISOString(),
    }
    this.tasks.push(newTask)
    saveTasks(this.tasks)
    return newTask
  }

  complete(id: string): boolean {
    const task = this.tasks.find((t) => t.id === id)
    if (!task || task.completed) return false
    task.completed = true
    saveTasks(this.tasks)
    return true
  }

  remove(id: string): boolean {
    const originalLength = this.tasks.length
    this.tasks = this.tasks.filter((t) => t.id !== id)
    const removed = this.tasks.length < originalLength
    if (removed) saveTasks(this.tasks)
    return removed
  }
}
