import fetch from "node-fetch"

interface Order { price: number; size: number }
interface OrderBook { bids: Order[]; asks: Order[]; timestamp: number }
interface BookSummary {
  midPrice: number
  spreadPercent: number
  imbalance: number
  totalDepthUsd: number
  timestamp: number
}

export class TokenOrderBookAnalyzer {
  constructor(private apiBase: string = process.env.DEX_API_BASE!) {}

  async fetchOrderBook(symbol: string, depth = 50): Promise<OrderBook> {
    const res = await fetch(`${this.apiBase}/markets/${symbol}/orderbook?depth=${depth}`)
    if (!res.ok) throw new Error(res.statusText)
    return await res.json() as OrderBook
  }

  midPrice(book: OrderBook): number {
    const bid = book.bids[0]?.price || 0
    const ask = book.asks[0]?.price || 0
    return (bid + ask) / 2
  }

  spreadPercent(book: OrderBook): number {
    const bid = book.bids[0]?.price || 0
    const ask = book.asks[0]?.price || 0
    return bid && ask ? ((ask - bid) / ((ask + bid) / 2)) * 100 : 0
  }

  imbalance(book: OrderBook): number {
    const bidVol = book.bids.reduce((s, o) => s + o.size, 0)
    const askVol = book.asks.reduce((s, o) => s + o.size, 0)
    const total = bidVol + askVol
    return total ? (bidVol - askVol) / total : 0
  }

  totalDepthUsd(book: OrderBook, levels = 10): number {
    const bids = book.bids.slice(0, levels)
    const asks = book.asks.slice(0, levels)
    const bidVal = bids.reduce((s, o) => s + o.price * o.size, 0)
    const askVal = asks.reduce((s, o) => s + o.price * o.size, 0)
    return bidVal + askVal
  }

  summarize(book: OrderBook, levels = 10): BookSummary {
    return {
      midPrice: this.midPrice(book),
      spreadPercent: this.spreadPercent(book),
      imbalance: this.imbalance(book),
      totalDepthUsd: this.totalDepthUsd(book, levels),
      timestamp: book.timestamp
    }
  }
}
