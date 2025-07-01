import { Connection, PublicKey, ParsedInstruction, ParsedConfirmedTransaction } from "@solana/web3.js"

export interface PatternAlert {
  signature: string
  pattern: string
  slot: number
}

export class TokenPatternDetector {
  private connection: Connection

  constructor(rpcUrl: string) {
    this.connection = new Connection(rpcUrl)
  }


  async detect(mintAddress: string, limit: number = 100): Promise<PatternAlert[]> {
    const pubkey = new PublicKey(mintAddress)
    const sigInfos = await this.connection.getSignaturesForAddress(pubkey, { limit })
    const alerts: PatternAlert[] = []

    for (const info of sigInfos) {
      const tx = await this.connection.getParsedConfirmedTransaction(info.signature)
      if (tx) {
        this.matchPatterns(tx, alerts)
      }
    }
    return alerts
  }

  private matchPatterns(
    tx: ParsedConfirmedTransaction,
    alerts: PatternAlert[]
  ) {
    const sig = tx.transaction.signatures[0]
    const slot = tx.slot
    const instructions = tx.transaction.message.instructions as ParsedInstruction[]

    for (const instr of instructions) {
      const parsed = instr.parsed as any
      if (
        instr.program === "spl-token" &&
        parsed.type === "transfer" &&
        Number(parsed.info.amount) > 1_000_000 
      ) {
        alerts.push({
          signature: sig,
          pattern: "large-transfer",
          slot
        })
      }
      if (
        instr.program === "spl-token-swap" &&
        parsed.info.swapType === "swap"
      ) {
        alerts.push({
          signature: sig,
          pattern: "swap-event",
          slot
        })
      }
    }
  }
}
