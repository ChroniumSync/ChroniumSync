import React from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { LogicResult } from "../logicbox/logicService"

interface SentimentData {
  label: string
  value: number
}

interface WidgetProps {
  data: LogicResult[]
}

export const MarketSentimentWidget: React.FC<WidgetProps> = ({ data }) => {
  // categorize results into sentiment buckets
  const buckets: Record<string, number> = {
    Low: 0,
    Medium: 0,
    High: 0
  }

  data.forEach((r) => {
    if (r.score < 40) buckets.Low += 1
    else if (r.score < 70) buckets.Medium += 1
    else buckets.High += 1
  })

  const chartData: SentimentData[] = Object.entries(buckets).map(
    ([label, value]) => ({ label, value })
  )

  return (
    <div className="w-full h-64 bg-white rounded-xl shadow p-4">
      <h3 className="text-lg font-medium mb-2">Market Sentiment</h3>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={chartData}>
          <XAxis dataKey="label" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
)
}
