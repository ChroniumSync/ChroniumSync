
import express from "express"
import dotenv from "dotenv"
import { ScannerService } from "./scannerService"

dotenv.config()

const app = express()
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000
app.use(express.json())

const service = new ScannerService()

app.post("/scan", async (req, res) => {
  const { address } = req.body
  if (!address) return res.status(400).json({ error: "address is required" })
  try {
    const result = await service.scan(address)
    res.json(result)
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

app.post("/batch-scan", async (req, res) => {
  const { addresses } = req.body
  if (!Array.isArray(addresses) || !addresses.length) {
    return res.status(400).json({ error: "addresses must be a non-empty array" })
  }
  try {
    const results = await service.batchScan(addresses)
    res.json({ results })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

app.get("/history/:address", async (req, res) => {
  try {
    const history = await service.history(req.params.address)
    res.json({ history })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
})

app.listen(port, () => {
  console.log(`Scanner API listening on port ${port}`)
})
