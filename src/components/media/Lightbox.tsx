import { useEffect } from 'react'
import { MediaItem } from '../../types'

interface LightboxProps {
  items: MediaItem[]
  currentIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

const Lightbox = ({ items, currentIndex, onClose, onPrev, onNext }: LightboxProps) => {
  const current = items[currentIndex]

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [onClose, onPrev, onNext])

  if (!current) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={current.title}
      onClick={onClose}
    >
      <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button
          type="button"
          aria-label="Close"
          className="absolute -top-10 right-0 text-white hover:text-gray-300"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
            <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Content */}
        <div className="relative bg-black rounded-lg overflow-hidden max-h-[80vh]">
          {current.type === 'image' ? (
            <img
              src={current.url}
              alt={current.title}
              referrerPolicy="no-referrer"
              onError={(e) => {
                const img = e.currentTarget
                if ((img as any).dataset.fallbackApplied === 'true') return
                ;(img as any).dataset.fallbackApplied = 'true'
                img.src = '/media/placeholder-image.svg'
              }}
              className="w-full h-auto object-contain"
            />
          ) : (
            <video
              controls
              className="w-full h-auto max-h-[80vh]"
              poster={current.thumbnailUrl}
              preload="metadata"
            >
              <source src={current.url} />
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {/* Title/description */}
        <div className="mt-3 text-white">
          <div className="text-lg font-semibold">{current.title}</div>
          {current.description && (
            <div className="text-sm text-gray-300 mt-1">{current.description}</div>
          )}
        </div>

        {/* Navigation */}
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none">
          <button
            type="button"
            aria-label="Previous"
            className="pointer-events-auto p-3 text-white hover:text-gray-300"
            onClick={onPrev}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next"
            className="pointer-events-auto p-3 text-white hover:text-gray-300"
            onClick={onNext}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Lightbox


