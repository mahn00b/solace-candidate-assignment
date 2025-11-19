import * as React from "react"
import { cn } from "@/lib/utils"

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
}

const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  ({ className, size = 'md', ...props }, ref) => {
    const sizeClasses = {
      sm: 'w-2 h-2',
      md: 'w-3 h-3',
      lg: 'w-4 h-4'
    }

    const gapClasses = {
      sm: 'gap-1',
      md: 'gap-2',
      lg: 'gap-3'
    }

    return (
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        ref={ref}
        className={cn("flex items-center justify-center", gapClasses[size], className)}
        {...props}
      >
        <span className="sr-only">Loading...</span>
        <div
          className={cn(
            "rounded-full bg-current animate-bounce",
            sizeClasses[size]
          )}
          style={{ animationDelay: '0ms', animationDuration: '1s' }}
        />
        <div
          className={cn(
            "rounded-full bg-current animate-bounce",
            sizeClasses[size]
          )}
          style={{ animationDelay: '150ms', animationDuration: '1s' }}
        />
        <div
          className={cn(
            "rounded-full bg-current animate-bounce",
            sizeClasses[size]
          )}
          style={{ animationDelay: '300ms', animationDuration: '1s' }}
        />
      </div>
    )
  }
)
Loader.displayName = "Loader"

export { Loader }
