
import dotenv from "dotenv"
import readline from "readline"
import { ScannerService, ScanResult } from "./scannerService"

dotenv.config()

const service = new ScannerService()
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

function print(result: ScanResult) {
  console.log(`Address:        ${result.address}`)
  console.log(`Scam Detected:  ${result.isScam}`)
  console.log(`Suspicious:     ${result.suspiciousScore.toFixed(2)}`)
  if (result.tags.length) console.log(`Tags:           ${result.tags.join(", ")}`)
  console.log("────────────────────────────────────────")
}

async function promptScan() {
  rl.question("Enter address or comma-separated list: ", async (input) => {
    const addrs = input.split(",").map((s) => s.trim()).filter(Boolean)
    try {
      const results = await service.batchScan(addrs)
      results.forEach(print)
    } catch (e: any) {
      console.error("Error:", e.message)
    } finally {
      rl.close()
    }
  })
}

async function promptHistory() {
  rl.question("Enter address for history: ", async (addr) => {
    try {
      const hist = await service.history(addr.trim())
      hist.forEach(print)
    } catch (e: any) {
      console.error("Error:", e.message)
    } finally {
      rl.close()
    }
  })
}

const mode = process.argv[2]
if (mode === "history") {
  promptHistory()
} else {
  promptScan()
}
