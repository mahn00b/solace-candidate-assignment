import * as React from "react"
import { X } from 'lucide-react'
import { cn } from "@/lib/utils"

interface SimpleDialogProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export function SimpleDialog({ open, onClose, children, className }: SimpleDialogProps) {
  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  // Prevent body scroll when dialog is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/80"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div
            className={cn(
              "relative w-full max-w-lg bg-white rounded-lg shadow-lg p-6",
              className
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>

            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export function SimpleDialogHeader({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("mb-4", className)}>
      {children}
    </div>
  )
}

export function SimpleDialogTitle({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h2 className={cn("text-2xl font-semibold leading-none tracking-tight", className)}>
      {children}
    </h2>
  )
}
