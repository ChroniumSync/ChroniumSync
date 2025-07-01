import React from "react"

interface TokenOverviewProps {
  name: string
  symbol: string
  price: number
  change24h: number
  liquidity: number
  holders: number
  confidenceScore?: number
}

export const TokenOverviewPanel: React.FC<TokenOverviewProps> = ({
  name,
  symbol,
  price,
  change24h,
  liquidity,
  holders,
  confidenceScore = 0
}) => {
  const changePositive = change24h >= 0
  const arrow = changePositive ? "▲" : "▼"

  return (
    <div className="border rounded-lg p-4 flex flex-col space-y-2">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold">{name} <span className="text-gray-500">({symbol})</span></h4>
        <span className="text-sm">Score: {confidenceScore}</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p>Price</p>
          <p>${price.toFixed(4)}</p>
        </div>
        <div>
          <p>Change 24h</p>
          <p>
            {arrow} {Math.abs(change24h).toFixed(2)}%
          </p>
        </div>
        <div>
          <p>Liquidity</p>
          <p>{liquidity.toLocaleString()}</p>
        </div>
        <div>
          <p>Holders</p>
          <p>{holders.toLocaleString()}</p>
        </div>
      </div>
    </div>
)
}
