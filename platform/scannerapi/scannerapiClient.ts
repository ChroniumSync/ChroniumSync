import dotenv from "dotenv"
import readline from "readline"
import { ScannerApiService, ScanResult } from "./scannerapiService"

dotenv.config()

const SERVICE = new ScannerApiService()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function printResult(result: ScanResult) {
  console.log("Address:", result.address)
  console.log("Scam Detected:", result.isScam)
  console.log("Suspicious Score:", result.suspiciousScore.toFixed(2))
  if (result.tags.length) {
    console.log("Tags:", result.tags.join(", "))
  }
  console.log("──────────────────────────────────────────")
}

async function promptScan() {
  rl.question("Enter wallet address (or multiple, comma-separated): ", async (input) => {
    const addresses = input.split(",").map((a) => a.trim())
    try {
      console.log("Scanning addresses...")
      const results = await SERVICE.scanAddresses(addresses)
      results.forEach(printResult)
    } catch (err) {
      console.error("Error:", err)
    } finally {
      rl.close()
    }
  })
}

async function showHistory() {
  rl.question("Enter address to fetch history: ", async (address) => {
    try {
      console.log(`Fetching history for ${address}...`)
      const history = await SERVICE.getHistory(address)
      history.forEach(printResult)
    } catch (err) {
      console.error("Error:", err)
    } finally {
      rl.close()
    }
  })
}

const mode = process.argv[2]
if (mode === "history") {
  showHistory()
} else {
  promptScan()
}
