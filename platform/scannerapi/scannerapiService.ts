import fetch from "node-fetch"

export interface ScanResult {
  address: string
  isScam: boolean
  suspiciousScore: number
  tags: string[]
}

export class ScannerApiService {
  private readonly baseUrl: string

  constructor(baseUrl: string = process.env.SCANNER_API_BASE_URL!) {
    if (!baseUrl) {
      throw new Error("SCANNER_API_BASE_URL must be set")
    }
    this.baseUrl = baseUrl
  }

  /**
   * Scans a single wallet address for known threat patterns
   */
  async scanAddress(address: string): Promise<ScanResult> {
    const url = `${this.baseUrl}/scan/${address}`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to scan ${address}: ${response.statusText}`)
    }
    const data = await response.json()
    return {
      address: data.address,
      isScam: data.is_scam,
      suspiciousScore: data.score,
      tags: data.tags || []
    }
  }

  /**
   * Batch scans multiple addresses in parallel
   */
  async scanAddresses(addresses: string[]): Promise<ScanResult[]> {
    const promises = addresses.map((addr) => this.scanAddress(addr))
    return Promise.all(promises)
  }

  /**
   * Retrieves historical scan results for an address
   */
  async getHistory(address: string): Promise<ScanResult[]> {
    const url = `${this.baseUrl}/history/${address}`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch history for ${address}`)
    }
    const data = await response.json()
    return data.history.map((entry: any) => ({
      address: entry.address,
      isScam: entry.is_scam,
      suspiciousScore: entry.score,
      tags: entry.tags || []
    }))
  }
}
