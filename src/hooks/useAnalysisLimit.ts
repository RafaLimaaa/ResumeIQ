import { useState, useCallback } from 'react'

const STORAGE_KEY = 'resumeiq_free_count'
const FREE_LIMIT = 3

interface UseAnalysisLimitReturn {
  freeCount: number
  isLimited: boolean
  remaining: number
  increment: () => void
  reset: () => void
}

export function useAnalysisLimit(): UseAnalysisLimitReturn {
  const [freeCount, setFreeCount] = useState<number>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? parseInt(stored, 10) : 0
  })

  const isLimited = freeCount >= FREE_LIMIT
  const remaining = Math.max(0, FREE_LIMIT - freeCount)

  const increment = useCallback(() => {
    setFreeCount((prev) => {
      const next = prev + 1
      localStorage.setItem(STORAGE_KEY, String(next))
      return next
    })
  }, [])

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setFreeCount(0)
  }, [])

  return { freeCount, isLimited, remaining, increment, reset }
}
