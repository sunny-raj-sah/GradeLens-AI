 import axios from 'axios'

interface ApiErrorResponse {
  message?: string
  errors?: {
    field?: string
    message?: string
  }[]
}

export function getApiError(
  error: unknown,
  fallback: string,
): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const data = error.response?.data

    if (data?.errors?.length) {
      return data.errors
        .map((item) =>
          item.field
            ? `${item.field}: ${item.message}`
            : item.message,
        )
        .filter(Boolean)
        .join(', ')
    }

    return data?.message ?? fallback
  }

  return error instanceof Error ? error.message : fallback
}