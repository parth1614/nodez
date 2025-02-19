import { useCallback, useEffect, useState } from 'react'

export const useLocalStorage = <T extends unknown>(
  key: string,
  initialValue?: T,
) => {
  const isClient = typeof window !== 'undefined' // Check if window is available

  const get = () => {
    if (!isClient) return initialValue
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) : initialValue
  }

  const set = useCallback(
    (value: T) => {
      if (isClient) {
        window.localStorage.setItem(key, JSON.stringify(value))
      }
    },
    [key, isClient],
  )

  const remove = useCallback(() => {
    if (isClient) {
      window.localStorage.removeItem(key)
    }
  }, [isClient])

  const [value, setValue] = useState<T>(() => get())

  useEffect(() => {
    set(value)
  }, [value, set])

  return { value, setValue, remove }
}
