import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAnalysisLimit } from '../../hooks/useAnalysisLimit'

const STORAGE_KEY = 'resumeiq_free_count'

describe('useAnalysisLimit', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts at 0 with no stored value', () => {
    const { result } = renderHook(() => useAnalysisLimit())
    expect(result.current.freeCount).toBe(0)
    expect(result.current.remaining).toBe(3)
    expect(result.current.isLimited).toBe(false)
  })

  it('reads existing count from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, '2')
    const { result } = renderHook(() => useAnalysisLimit())
    expect(result.current.freeCount).toBe(2)
    expect(result.current.remaining).toBe(1)
    expect(result.current.isLimited).toBe(false)
  })

  it('increments count and persists to localStorage', () => {
    const { result } = renderHook(() => useAnalysisLimit())
    act(() => result.current.increment())
    expect(result.current.freeCount).toBe(1)
    expect(localStorage.getItem(STORAGE_KEY)).toBe('1')
  })

  it('marks as limited after 3 increments', () => {
    const { result } = renderHook(() => useAnalysisLimit())
    act(() => result.current.increment())
    act(() => result.current.increment())
    act(() => result.current.increment())
    expect(result.current.isLimited).toBe(true)
    expect(result.current.remaining).toBe(0)
  })

  it('resets count on reset()', () => {
    localStorage.setItem(STORAGE_KEY, '3')
    const { result } = renderHook(() => useAnalysisLimit())
    act(() => result.current.reset())
    expect(result.current.freeCount).toBe(0)
    expect(result.current.isLimited).toBe(false)
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})
