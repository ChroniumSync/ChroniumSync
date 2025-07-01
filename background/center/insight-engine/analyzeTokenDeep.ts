
import { Connection, PublicKey } from "@solana/web3.js"

export interface DeepMetrics {
  holderCount: number
  totalSupply: number
  avgBalance: number
  activeHolders: number
}

export class TokenDeepAnalyzer {
  private connection: Connection

  constructor(rpcUrl: string) {
    this.connection = new Connection(rpcUrl)
  }

  /**
   * Gathers holder distribution and supply stats
   */
  async analyze(mintAddress: string): Promise<DeepMetrics> {
    const pubkey = new PublicKey(mintAddress)
    const accounts = await this.connection.getParsedTokenAccountsByOwner(pubkey, {
      programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
    })

    const balances = accounts.value.map(acc => {
      const info = (acc.account.data as ParsedAccountData).parsed.info.tokenAmount
      return Number(info.uiAmount)
    })

    const totalSupply = balances.reduce((a, b) => a + b, 0)
    const holderCount = balances.length
    const avgBalance = holderCount ? totalSupply / holderCount : 0
    const activeHolders = balances.filter(b => b > 0).length

    return { holderCount, totalSupply, avgBalance, activeHolders }
  }
}
