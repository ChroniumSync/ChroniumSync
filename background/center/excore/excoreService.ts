import { Connection, PublicKey, ParsedAccountData } from "@solana/web3.js"

export interface ExCoreMetric {
  address: string
  transactionCount: number
  tokenHoldings: Record<string, number>
}

export class ExCoreService {
  private connection: Connection

  constructor(rpcUrl: string) {
    this.connection = new Connection(rpcUrl, "confirmed")
  }

  async analyzeAddress(address: string): Promise<ExCoreMetric> {
    const pubkey = new PublicKey(address)

    const sigInfos = await this.connection.getSignaturesForAddress(pubkey, { limit: 100 })
    const transactionCount = sigInfos.length

    const resp = await this.connection.getParsedTokenAccountsByOwner(
      pubkey,
      { programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") }
    )
    const tokenHoldings: Record<string, number> = {}
    resp.value.forEach((acct) => {
      const parsed = acct.account.data as ParsedAccountData
      const info = parsed.parsed.info.tokenAmount
      tokenHoldings[info.mint] = (tokenHoldings[info.mint] || 0) + Number(info.uiAmount)
    })

    return { address, transactionCount, tokenHoldings }
  }
}
