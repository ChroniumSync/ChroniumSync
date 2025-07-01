import express from "express"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import { ExCoreService } from "./excoreService"

dotenv.config()

const app = express()
app.use(bodyParser.json())

const service = new ExCoreService(process.env.SOLANA_RPC_ENDPOINT!)

app.post("/analyze", async (req, res) => {
  const { address } = req.body
  if (!address) {
    return res.status(400).json({ error: "address is required" })
  }
  try {
    const metric = await service.analyzeAddress(address)
    res.json(metric)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

const port = parseInt(process.env.PORT || "3000")
app.listen(port, () => {
  console.log(`ExCore API listening on port ${port}`)
})