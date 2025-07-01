import { Connection, PublicKey, ParsedAccountData } from "@solana/web3.js"

export interface RiskScore {
  address: string
  score: number  // 0–100
  level: "low" | "medium" | "high"
}

export class RiskScoringService {
  private connection: Connection

  constructor(rpcUrl: string) {
    this.connection = new Connection(rpcUrl)
  }


  async computeScore(address: string): Promise<RiskScore> {
    const pubkey = new PublicKey(address)
    const [balanceInfo, accountInfo] = await Promise.all([
      this.connection.getTokenAccountsByOwner(pubkey, { programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") }),
      this.connection.getAccountInfo(pubkey, "confirmed")
    ])

    const totalTokens = balanceInfo.value.reduce((sum, acc) => {
      const parsed = acc.account.data as ParsedAccountData
      return sum + Number(parsed.parsed.info.tokenAmount.amount)
    }, 0)

    const rawSize = accountInfo?.data.length ?? 0
    const rawScore = Math.min(100, ((totalTokens * 0.4) + (rawSize * 0.6 / 1024)) )
    const score = Math.round(rawScore)
    const level = score > 70 ? "high" : score > 40 ? "medium" : "low"

    return { address, score, level }
  }
}
