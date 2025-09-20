import { forwardRef } from 'react'
import { cn } from '@/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'green' | 'gray' | 'blue' | 'purple' | 'red'
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
      default: 'border-transparent bg-primary text-primary-foreground',
      secondary: 'border-transparent bg-secondary text-secondary-foreground',
      destructive: 'border-transparent bg-destructive text-destructive-foreground',
      outline: 'text-foreground',
      success: 'border-transparent bg-green-500 text-white',
      warning: 'border-transparent bg-yellow-500 text-black',
      green: 'border-transparent bg-green-500 text-white',
      gray: 'border-transparent bg-gray-500 text-white',
      blue: 'border-transparent bg-blue-500 text-white',
      purple: 'border-transparent bg-purple-500 text-white',
      red: 'border-transparent bg-red-500 text-white',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          variants[variant],
          className
        )}
        {...props}
      />
    )
  }
)

Badge.displayName = 'Badge'

export { Badge }
