import { Connection, PublicKey, ConfirmedSignatureInfo } from "@solana/web3.js"

export type HeatmapPoint = { hour: number; weekday: number; count: number }

export class TokenActivityHeatmap {
  private connection: Connection

  constructor(rpcUrl: string) {
    this.connection = new Connection(rpcUrl)
  }

  async generateHeatmap(mintAddress: string): Promise<HeatmapPoint[]> {
    const pubkey = new PublicKey(mintAddress)
    const now = Date.now() / 1000
    const weekAgo = now - 7 * 24 * 3600

    const sigs: ConfirmedSignatureInfo[] = await this.connection.getSignaturesForAddress(pubkey, { limit: 1000, before: undefined, until: undefined })
    const filtered = sigs.filter(s => s.blockTime && s.blockTime >= weekAgo)

    const buckets: Record<string, number> = {}
    for (const sig of filtered) {
      const dt = new Date((sig.blockTime ?? 0) * 1000)
      const key = `${dt.getDay()}-${dt.getHours()}`
      buckets[key] = (buckets[key] || 0) + 1
    }

    const result: HeatmapPoint[] = []
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        const key = `${day}-${hour}`
        result.push({ weekday: day, hour, count: buckets[key] || 0 })
      }
    }
    return result
  }
}
