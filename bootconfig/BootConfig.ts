import { z } from "zod"

const configSchema = z.object({
  PORT: z.string().optional().default("3000"),
  LOG_LEVEL: z
    .enum(["debug", "info", "warn", "error"])
    .optional()
    .default("info"),
  SOLANA_RPC_ENDPOINT: z.string().url(),
  DEX_API_BASE: z.string().url(),
  SCANNER_API_BASE_URL: z.string().url(),
  AZURE_STORAGE_CONNECTION_STRING: z.string(),
})

export type BootConfig = {
  port: number
  logLevel: "debug" | "info" | "warn" | "error"
  solanaRpcEndpoint: string
  dexApiBase: string
  scannerApiBaseUrl: string
  azureStorageConnectionString: string
}

export function loadConfig(): BootConfig {
  const parsed = configSchema.safeParse(process.env)

  if (!parsed.success) {
    console.error("❌ Config validation failed:", parsed.error.format())
    throw new Error("Invalid environment configuration")
  }

  const env = parsed.data
  const port = parseInt(env.PORT, 10)

  if (isNaN(port) || port <= 0) {
    throw new Error(`Invalid PORT number: ${env.PORT}`)
  }

  return {
    port,
    logLevel: env.LOG_LEVEL,
    solanaRpcEndpoint: env.SOLANA_RPC_ENDPOINT,
    dexApiBase: env.DEX_API_BASE,
    scannerApiBaseUrl: env.SCANNER_API_BASE_URL,
    azureStorageConnectionString: env.AZUR
