
import { Connection, PublicKey, ParsedAccountData } from "@solana/web3.js"

export interface ActivityPoint {
  timestamp: number
  transfers: number
}

export class TokenActivityAnalyzer {
  private connection: Connection

  constructor(rpcUrl: string) {
    this.connection = new Connection(rpcUrl)
  }

  /**
   * Returns number of transfer instructions per hour over the last 24h
   */
  async analyze(mintAddress: string): Promise<ActivityPoint[]> {
    const pubkey = new PublicKey(mintAddress)
    const now = Date.now() / 1000
    const dayAgo = now - 24 * 3600
    const sigs = await this.connection.getSignaturesForAddress(pubkey, { limit: 1000 })
    const filtered = sigs.filter(s => s.blockTime && s.blockTime >= dayAgo)
    const buckets: Record<number, number> = {}

    for (const sig of filtered) {
      const hour = Math.floor((sig.blockTime! - dayAgo) / 3600)
      buckets[hour] = (buckets[hour] || 0) + 1
    }

    const result: ActivityPoint[] = []
    for (let h = 0; h < 24; h++) {
      result.push({ timestamp: dayAgo + h * 3600, transfers: buckets[h] || 0 })
    }
    return result
  }
}
