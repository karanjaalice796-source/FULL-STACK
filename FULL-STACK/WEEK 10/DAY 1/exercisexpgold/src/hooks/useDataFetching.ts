import { useCallback, useEffect, useRef, useState } from 'react'

interface CacheEntry {
  data: unknown
  savedAt: number
}

interface FetchConfig {
  maxAge?: number
}

interface DataFetchingResult<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  fetchedAt: number | null
  refetch: () => Promise<void>
  invalidateCache: () => Promise<void>
}

const dataCache = new Map<string, CacheEntry>()
const DEFAULT_MAX_AGE = 5 * 60 * 1000

export default function useDataFetching<T>(
  url: string,
  { maxAge = DEFAULT_MAX_AGE }: FetchConfig = {},
): DataFetchingResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fetchedAt, setFetchedAt] = useState<number | null>(null)
  const requestController = useRef<AbortController | null>(null)

  const load = useCallback(async (ignoreCache = false) => {
    requestController.current?.abort()
    const controller = new AbortController()
    requestController.current = controller
    setIsLoading(true)
    setError(null)

    const cached = dataCache.get(url)
    if (!ignoreCache && cached && Date.now() - cached.savedAt < maxAge) {
      setData(cached.data as T)
      setFetchedAt(cached.savedAt)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(url, { signal: controller.signal })
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}.`)
      }

      const result: T = await response.json()
      if (controller.signal.aborted) return

      const savedAt = Date.now()
      dataCache.set(url, { data: result, savedAt })
      setData(result)
      setFetchedAt(savedAt)
    } catch (fetchError) {
      if (controller.signal.aborted) return
      setError(fetchError instanceof Error ? fetchError.message : 'An unexpected error occurred.')
    } finally {
      if (!controller.signal.aborted) setIsLoading(false)
    }
  }, [maxAge, url])

  useEffect(() => {
    void load()
    return () => requestController.current?.abort()
  }, [load])

  const refetch = useCallback(() => load(true), [load])

  const invalidateCache = useCallback(async () => {
    dataCache.delete(url)
    await load(true)
  }, [load, url])

  return { data, isLoading, error, fetchedAt, refetch, invalidateCache }
}
