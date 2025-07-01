import fetch from "node-fetch"

export interface ScanResult {
  address: string
  isScam: boolean
  suspiciousScore: number
  tags: string[]
}

export class ScannerService {
  private readonly baseUrl: string

  constructor(baseUrl: string = process.env.SCANNER_API_BASE_URL!) {
    if (!baseUrl) {
      throw new Error("SCANNER_API_BASE_URL must be set")
    }
    this.baseUrl = baseUrl
  }


  async scan(address: string): Promise<ScanResult> {
    const res = await fetch(`${this.baseUrl}/scan/${address}`)
    if (!res.ok) {
      throw new Error(`Scan failed for ${address}: ${res.statusText}`)
    }
    const data = await res.json()
    return {
      address: data.address,
      isScam: data.is_scam,
      suspiciousScore: data.score,
      tags: data.tags || []
    }
  }

  /**
   * Scan multiple addresses concurrently
   */
  async batchScan(addresses: string[]): Promise<ScanResult[]> {
    return Promise.all(addresses.map((addr) => this.scan(addr)))
  }

  /**
   * Fetch scan history for an address
   */
  async history(address: string): Promise<ScanResult[]> {
    const res = await fetch(`${this.baseUrl}/history/${address}`)
    if (!res.ok) {
      throw new Error(`History fetch failed for ${address}`)
    }
    const data = await res.json()
    return data.history.map((h: any) => ({
      address: h.address,
      isScam: h.is_scam,
      suspiciousScore: h.score,
      tags: h.tags || []
    }))
  }
}
