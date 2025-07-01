import React, { useEffect, useState } from "react"
import { TokenOverviewPanel } from "./TokenOverviewPanel"
import { MarketSentimentWidget } from "./MarketSentimentWidget"
import { LogicResult } from "../logicbox/logicService"

interface DashboardProps {
  walletAddresses: string[]
}

export const AnalyzerDashboard: React.FC<DashboardProps> = ({ walletAddresses }) => {
  const [logicResults, setLogicResults] = useState<LogicResult[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAnalysis() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ addresses: walletAddresses })
        })
        if (!response.ok) {
          throw new Error(`Server error: ${response.statusText}`)
        }
        const json = await response.json()
        setLogicResults(json.results)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    if (walletAddresses.length) {
      fetchAnalysis()
    }
  }, [walletAddresses])

  return (
    <div className="p-6 grid gap-8 grid-cols-1 lg:grid-cols-2">
      {loading && <p>Loading analysis…</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && !error && logicResults.length > 0 && (
        <>
          <section className="col-span-full">
            <h1 className="text-2xl font-semibold mb-4">Dashboard Overview</h1>
            <MarketSentimentWidget data={logicResults} />
          </section>

          <section className="col-span-full">
            <h2 className="text-xl font-medium mb-2">Per-Address Risk Scores</h2>
            <div className="space-y-4">
              {logicResults.map((res) => (
                <TokenOverviewPanel
                  key={res.key}
                  name={res.key}
                  symbol="N/A"
                  price={0}
                  change24h={0}
                  liquidity={0}
                  holders={0}
                  confidenceScore={res.score}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
)
}
