import dotenv from "dotenv"
import { LogicService, LogicResult } from "./logicService"

dotenv.config()

const SERVICE = new LogicService(process.env.SOLANA_RPC_ENDPOINT!)

export async function runAnalysis(addresses: string[]): Promise<LogicResult[]> {
  const results: LogicResult[] = []
  for (const addr of addresses) {
    try {
      const res = await SERVICE.computeRisk(addr)
      results.push(res)
    } catch {
      results.push({ key: addr, score: 0, flagged: false })
    }
  }
  return results
}
