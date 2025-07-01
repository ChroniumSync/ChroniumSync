import express from "express"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import { runAnalysis } from "./logicController"

dotenv.config()

const app = express()
app.use(bodyParser.json())

app.post("/analyze", async (req, res) => {
  const { addresses } = req.body
  if (!Array.isArray(addresses) || addresses.length === 0) {
    return res.status(400).json({ error: "addresses must be a non-empty array" })
  }
  try {
    const output = await runAnalysis(addresses)
    res.json({ results: output })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000
app.listen(port, () => {
  console.log(`LogicBox server listening on port ${port}`)
})
