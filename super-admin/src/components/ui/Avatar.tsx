import React from 'react'
import { cn } from '@/utils'

interface AvatarProps {
  src?: string
  alt?: string
  fallback?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

interface AvatarImageProps {
  src?: string
  alt?: string
  className?: string
}

interface AvatarFallbackProps {
  children: React.ReactNode
  className?: string
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt, fallback, className, size = 'md', ...props }, ref) => {
    const getSizeClasses = () => {
      switch (size) {
        case 'sm':
          return 'h-6 w-6 text-xs'
        case 'lg':
          return 'h-12 w-12 text-lg'
        default:
          return 'h-8 w-8 text-sm'
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex shrink-0 overflow-hidden rounded-full',
          getSizeClasses(),
          className
        )}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="aspect-square h-full w-full object-cover"
          />
        ) : (
          <AvatarFallback>{fallback}</AvatarFallback>
        )}
      </div>
    )
  }
)
Avatar.displayName = 'Avatar'

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ src, alt, className, ...props }, ref) => (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={cn('aspect-square h-full w-full object-cover', className)}
      {...props}
    />
  )
)
AvatarImage.displayName = 'AvatarImage'

const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex h-full w-full items-center justify-center rounded-full bg-muted font-medium',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
AvatarFallback.displayName = 'AvatarFallback'

// Export components
export { Avatar, AvatarImage, AvatarFallback }
export default Avatar

// Export types
export type { AvatarProps, AvatarImageProps, AvatarFallbackProps }
