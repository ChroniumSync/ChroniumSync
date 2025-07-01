import dotenv from "dotenv";
import { DexCheckService, DexPairInfo } from "./dexcheckService";

dotenv.config();

const SERVICE = new DexCheckService();

/**
 * Formats and prints pair info to console
 */
function printPairInfo(pair: DexPairInfo) {
  console.log("Pair Address:", pair.pairAddress);
  console.log("Base Token:", pair.baseToken.symbol, `(${pair.baseToken.address})`);
  console.log("  Price USD:", pair.baseToken.priceUsd.toFixed(6));
  console.log("  Volume 24h USD:", pair.baseToken.volumeUsd24h.toFixed(2));
  console.log("  Liquidity USD:", pair.baseToken.liquidityUsd.toFixed(2));
  console.log("Quote Token:", pair.quoteToken.symbol, `(${pair.quoteToken.address})`);
  console.log("  Price USD:", pair.quoteToken.priceUsd.toFixed(6));
  console.log("--------------------------------------------------");
}

async function main() {
  const [tokenAddress] = process.argv.slice(2);
  if (!tokenAddress) {
    console.error("Usage: ts-node dexcheck.ts <TOKEN_MINT_ADDRESS>");
    process.exit(1);
  }

  try {
    console.log(`Fetching DEX data for token: ${tokenAddress}`);
    const topPair = await SERVICE.getTopLiquidityPair(tokenAddress.toLowerCase());
    if (!topPair) {
      console.log("No pairs found for this token.");
      process.exit(0);
    }
    console.log("Top liquidity pair:");
    printPairInfo(topPair);
  } catch (error) {
    console.error("Error fetching DEX data:", error);
    process.exit(1);
  }
}

main();
