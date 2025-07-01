
import express from "express"
import dotenv from "dotenv"
import { SafeboxService } from "./safeboxService"

dotenv.config()

const app = express()
const port = parseInt(process.env.PORT || "4000")
app.use(express.json())

const service = new SafeboxService(process.env.AZURE_STORAGE_CONNECTION_STRING!)

app.post("/upload", async (req, res) => {
  const { container, blob, content } = req.body
  if (!container || !blob || content == null) {
    return res.status(400).json({ error: "container, blob and content are required" })
  }
  try {
    await service.upload(container, blob, Buffer.from(content))
    res.json({ success: true })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

app.get("/download/:container/:blob", async (req, res) => {
  const { container, blob } = req.params
  try {
    const data = await service.download(container, blob)
    res.send(data)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

app.delete("/delete", async (req, res) => {
  const { container, blob } = req.body
  if (!container || !blob) {
    return res.status(400).json({ error: "container and blob are required" })
  }
  try {
    await service.delete(container, blob)
    res.json({ success: true })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(port, () => {
  console.log(`Safebox server listening on port ${port}`)
})
