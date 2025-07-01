import { Connection, PublicKey, ConfirmedSignatureInfo, ParsedTransactionWithMeta } from "@solana/web3.js"
import crypto from "crypto"

export interface EntropyResult {
  address: string
  entropy: number  
}

export class TransactionEntropyAnalyzer {
  private connection: Connection

  constructor(rpcUrl: string) {
    this.connection = new Connection(rpcUrl)
  }


  async analyzeEntropy(address: string): Promise<EntropyResult> {
    const pubkey = new PublicKey(address)
    const sigs: ConfirmedSignatureInfo[] = await this.connection.getSignaturesForAddress(pubkey, { limit: 256 })
    const signatureConcat = sigs.map(s => s.signature).join("")

    const buf = Buffer.from(signatureConcat, "utf8")
    const freq: Record<number, number> = {}
    for (const byte of buf) {
      freq[byte] = (freq[byte] || 0) + 1
    }

    const total = buf.length
    let entropy = 0
    for (const count of Object.values(freq)) {
      const p = count / total
      entropy -= p * Math.log2(p)
    }

    return { address, entropy }
  }
}
