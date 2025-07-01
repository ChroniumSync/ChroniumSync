import express from "express"
import bodyParser from "body-parser"
import { TaskService } from "./tasksService"

const app = express()
app.use(bodyParser.json())

const svc = new TaskService()

app.get("/tasks", (req, res) => {
  res.json(svc.list())
})

app.post("/tasks", (req, res) => {
  const { title, prompt, schedule } = req.body
  if (!title || !prompt || !schedule) {
    return res.status(400).json({ error: "title, prompt, and schedule are required" })
  }
  const task = svc.add(title, prompt, schedule)
  res.status(201).json(task)
})

app.post("/tasks/:id/complete", (req, res) => {
  const ok = svc.complete(req.params.id)
  return ok ? res.json({ success: true }) : res.status(404).json({ error: "Not found or already completed" })
})

app.delete("/tasks/:id", (req, res) => {
  const ok = svc.remove(req.params.id)
  return ok ? res.json({ success: true }) : res.status(404).json({ error: "Not found" })
})

const port = parseInt(process.env.PORT || "3000")
app.listen(port, () => {
  console.log(`Tasks API running on port ${port}`)
})
