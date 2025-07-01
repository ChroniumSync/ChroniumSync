import { Request, Response, NextFunction } from "express"
import { createErrorResponse } from "./apiResponse"
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err)
  const code = err.code || "INTERNAL_SERVER_ERROR"
  const message = err.message || "An unexpected error occurred"
  const details = err.details
  res.status(err.status || 500).json(createErrorResponse(code, message, details))
}


export function responseWrapper(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const originalJson = res.json.bind(res)
  res.json = (body: any) => {
    if (body && typeof body === "object" && ("success" in body)) {
      return originalJson(body)
    }
    return originalJson({ success: true, data: body })
  }
  next()
}
