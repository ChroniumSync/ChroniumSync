import { Connection, PublicKey, ParsedAccountData } from "@solana/web3.js"

export interface BurstPrediction {
  mint: string
  predictedWindowStart: number  // UNIX timestamp
  predictedWindowEnd: number
  confidence: number  // 0–1
}

export class TokenBurstPredictor {
  private connection: Connection

  constructor(rpcUrl: string) {
    this.connection = new Connection(rpcUrl)
  }


  async predictNextBurst(mintAddress: string): Promise<BurstPrediction> {
    const pubkey = new PublicKey(mintAddress)
    const accounts = await this.connection.getParsedTokenAccountsByOwner(pubkey, { programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") })

    const now = Date.now()
    const buckets: number[] = []
    for (const acc of accounts.value) {
      const parsed = acc.account.data as ParsedAccountData
      const amount = Number(parsed.parsed.info.tokenAmount.uiAmount)
      buckets.push(amount)
    }

    // simple analysis: compute moving average and detect rising trend
    const avg = buckets.reduce((a,b)=>a+b,0) / (buckets.length||1)
    const confidence = Math.min(1, avg / Math.max(...buckets,1))

    const windowStart = now + 3600 * 1000  // next hour
    const windowEnd = windowStart + 3600 * 1000

    return {
      mint: mintAddress,
      predictedWindowStart: Math.floor(windowStart / 1000),
      predictedWindowEnd: Math.floor(windowEnd / 1000),
      confidence
    }
  }
}
