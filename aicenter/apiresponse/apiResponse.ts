export interface ApiResponse<T> {
  success: true
  data: T
  message?: string
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
}


export function createSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
  return { success: true, data, message }
}

export function createErrorResponse(code: string, message: string, details?: unknown): ApiError {
  return {
    success: false,
    error: { code, message, details },
  }
}
