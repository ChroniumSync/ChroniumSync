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

type BootConfig = {
  port: number
  logLevel: "debug" | "info" | "warn" | "error"
  solanaRpcEndpoint: string
  dexApiBase: string
  scannerApiBaseUrl: string
  azureStorageConnectionString: string
}

export function loadConfig(): BootConfig {
  const env = configSchema.parse(process.env)

  return {
    port: parseInt(env.PORT, 10),
    logLevel: env.LOG_LEVEL,
    solanaRpcEndpoint: env.SOLANA_RPC_ENDPOINT,
    dexApiBase: env.DEX_API_BASE,
    scannerApiBaseUrl: env.SCANNER_API_BASE_URL,
    azureStorageConnectionString: env.AZURE_STORAGE_CONNECTION_STRING,
  }
}
