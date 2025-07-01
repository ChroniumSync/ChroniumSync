import dotenv from "dotenv"
import readline from "readline"
import { ExCoreService, ExCoreMetric } from "./excoreService"

dotenv.config()

const service = new ExCoreService(process.env.SOLANA_RPC_ENDPOINT!)
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

function printMetric(m: ExCoreMetric) {
  console.log(`Address:           ${m.address}`)
  console.log(`Recent TX Count:   ${m.transactionCount}`)
  console.log("Token Balances:")
  Object.entries(m.tokenHoldings).forEach(([mint, amt]) => {
    console.log(`  ${mint}: ${amt}`)
  })
  console.log("────────────────────────────────────────")
}

rl.question("Enter wallet address: ", async (addr) => {
  try {
    console.log("Analyzing...")
    const metric = await service.analyzeAddress(addr.trim())
    printMetric(metric)
  } catch (err: any) {
    console.error("Error:", err.message)
  } finally {
    rl.close()
  }
})