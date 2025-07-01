import { Connection, PublicKey } from "@solana/web3.js"

export interface LogicResult {
  key: string
  score: number
  flagged: boolean
}

export class LogicService {
  private connection: Connection

  constructor(rpcUrl: string) {
    this.connection = new Connection(rpcUrl)
  }

  async computeRisk(address: string): Promise<LogicResult> {
    const pubkey = new PublicKey(address)
    const accountInfo = await this.connection.getAccountInfo(pubkey, "confirmed")
    const raw = accountInfo?.data.length ?? 0
    const score = this.calculateScore(raw)
    return {
      key: address,
      score,
      flagged: score > 75
    }
  }

  private calculateScore(size: number): number {
    const normalized = Math.min(100, (size / 1024) * 10)
    return Math.round(normalized)
  }
}
