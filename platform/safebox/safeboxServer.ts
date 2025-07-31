import express, { Request, Response, NextFunction } from "express"
import dotenv from "dotenv"
import helmet from "helmet"
import morgan from "morgan"
import { z, ZodError } from "zod"
import { SafeboxService } from "./safeboxService"

dotenv.config()

const app = express()
const port = Number(process.env.PORT ?? 4000)
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
if (!connectionString) {
  console.error("Missing AZURE_STORAGE_CONNECTION_STRING")
  process.exit(1)
}

app.use(helmet())
app.use(express.json())
app.use(morgan("combined"))

const service = new SafeboxService(connectionString)

// Zod schemas
const uploadSchema = z.object({
  container: z.string().min(1),
  blob: z.string().min(1),
  content: z.string(),
})
const deleteSchema = z.object({
  container: z.string().min(1),
  blob: z.string().min(1),
})

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }))

// Upload endpoint
app.post("/upload", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { container, blob, content } = uploadSchema.parse(req.body)
    service.upload(container, blob, Buffer.from(content)).then(() => {
      res.status(201).json({ success: true })
    }).catch(next)
  } catch (err) {
    next(err)
  }
})

// Download endpoint
app.get("/download/:container/:blob", async (req, res, next) => {
  const { container, blob } = req.params
  if (!container || !blob) {
    return res.status(400).json({ error: "container and blob are required" })
  }
  try {
    const data = await service.download(container, blob)
    res.type("application/octet-stream").send(data)
  } catch (err) {
    next(err)
  }
})

// Delete endpoint
app.delete("/delete", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { container, blob } = deleteSchema.parse(req.body)
    service.delete(container, blob).then(() => {
      res.json({ success: true })
    }).catch(next)
  } catch (err) {
    next(err)
  }
})

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({ success: false, errors: err.issues })
  }
  console.error(err)
  res.status(500).json({ success: false, error: err.message ?? "Internal Server Error" })
})

app.listen(port, () => {
  console.log(`Safebox server listening on port ${port}`)
})
