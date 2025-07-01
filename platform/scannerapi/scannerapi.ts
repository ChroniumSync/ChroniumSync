
import express from "express"
import dotenv from "dotenv"
import { ScannerApiService } from "./scannerapiService"

dotenv.config()

const app = express()
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000
app.use(express.json())

const service = new ScannerApiService()

app.post("/scan", async (req, res) => {
  const { address } = req.body
  if (!address) {
    return res.status(400).json({ error: "address is required" })
  }
  try {
    const result = await service.scanAddress(address)
    res.json(result)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

app.post("/batch-scan", async (req, res) => {
  const { addresses } = req.body
  if (!Array.isArray(addresses) || !addresses.length) {
    return res.status(400).json({ error: "addresses must be a non-empty array" })
  }
  try {
    const results = await service.scanAddresses(addresses)
    res.json({ results })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

app.get("/history/:address", async (req, res) => {
  const { address } = req.params
  try {
    const history = await service.getHistory(address)
    res.json({ history })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(port, () => {
  console.log(`Scanner API server listening on port ${port}`)
})
