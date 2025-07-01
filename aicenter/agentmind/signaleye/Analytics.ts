import { Connection, PublicKey, ParsedAccountData, ConfirmedSignatureInfo } from "@solana/web3.js"

interface TokenAccount {
  mint: string
  amount: number
  decimals: number
}

interface TransferEvent {
  signature: string
  amount: number
}

export class TokenAnalytics {
  constructor(private rpcUrl: string) {}

  private getConnection() {
    return new Connection(this.rpcUrl, "confirmed")
  }

  async fetchTokenAccounts(owner: string): Promise<TokenAccount[]> {
    const conn = this.getConnection()
    const ownerKey = new PublicKey(owner)
    const resp = await conn.getParsedTokenAccountsByOwner(ownerKey, {
      programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
    })
    return resp.value.map(acc => {
      const info = (acc.account.data as ParsedAccountData).parsed.info.tokenAmount
      return {
        mint: info.mint,
        amount: Number(info.amount),
        decimals: info.decimals
      }
    })
  }

  calculateTotalSupply(accounts: TokenAccount[]): number {
    return accounts.reduce((sum, a) => sum + a.amount / 10 ** a.decimals, 0)
  }

  calculateHolderCount(accounts: TokenAccount[]): number {
    return accounts.filter(a => a.amount > 0).length
  }

  async detectLargeTransfers(mint: string, threshold: number = 1_000_000): Promise<TransferEvent[]> {
    const conn = this.getConnection()
    const mintKey = new PublicKey(mint)
    const sigs: ConfirmedSignatureInfo[] = await conn.getSignaturesForAddress(mintKey, { limit: 200 })
    const events: TransferEvent[] = []
    for (const s of sigs) {
      const tx = await conn.getParsedConfirmedTransaction(s.signature)
      if (!tx) continue
      for (const instr of tx.transaction.message.instructions as any[]) {
        if (instr.program === "spl-token" && instr.parsed.type === "transfer") {
          const amt = Number(instr.parsed.info.amount)
          if (amt > threshold) {
            events.push({ signature: s.signature, amount: amt })
          }
        }
      }
    }
    return events
  }
}
