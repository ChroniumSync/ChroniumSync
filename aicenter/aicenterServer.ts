import express from "express"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import { AICenterService } from "./aicenterService"

dotenv.config()

const app = express()
app.use(bodyParser.json())

const service = new AICenterService(
  process.env.AICENTER_API_URL!,
  process.env.AICENTER_API_KEY!
)

app.post("/analyze", async (req, res) => {
  const { input } = req.body
  if (!input) return res.status(400).json({ error: "input is required" })
  try {
    const result = await service.analyzeText(input)
    res.json(result)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

app.post("/summarize", async (req, res) => {
  const { input } = req.body
  if (!input) return res.status(400).json({ error: "input is required" })
  try {
    const result = await service.generateSummary(input)
    res.json(result)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

app.post("/anomalies", async (req, res) => {
  const { input } = req.body
  if (!input) return res.status(400).json({ error: "input is required" })
  try {
    const result = await service.detectAnomalies(input)
    res.json(result)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

const port = parseInt(process.env.PORT || "3000")
app.listen(port, () => {
  console.log(`AI Center API listening on port ${port}`)
})
