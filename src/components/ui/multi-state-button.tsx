'use client'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Check, Loader2 } from 'lucide-react'
import React from 'react'

const MultiStateButton = ({
  children,
  className,
  state,
  setState,
  onClick,
  onCompleted,
}: {
  children: React.ReactNode
  className: string
  state: 'initial' | 'loading' | 'success'
  setState: React.Dispatch<
    React.SetStateAction<'initial' | 'loading' | 'success'>
  >
  onClick?: () => void
  onCompleted?: () => void
}) => {
  const handleClick = () => {
    if (state === 'initial') {
      setState('loading')
      setTimeout(() => setState('success'), 2000)
      onClick?.()
    } else {
      onCompleted?.()
    }
  }

  return (
    <Button
      onClick={handleClick}
      variant={state === 'success' ? 'secondary' : 'default'}
      className={cn(
        `h-10 w-40 ${state === 'loading' ? 'cursor-wait' : ''}`,
        className,
      )}
      disabled={state === 'loading'}
    >
      {state === 'initial' && children}
      {state === 'loading' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {state === 'success' && <Check className="mr-2 h-4 w-4" />}
      {state === 'loading' && 'Loading...'}
      {state === 'success' && 'Success!'}
    </Button>
  )
}

export default MultiStateButton
