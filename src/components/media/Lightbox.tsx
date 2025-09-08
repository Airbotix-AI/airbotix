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

  const renderErrorModal = () => (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Media Load Error"
      onClick={onClose}
    >
      <div className="relative max-w-md w-full bg-white rounded-lg p-6 text-center" onClick={(e) => e.stopPropagation()}>
        <div className="text-4xl mb-3">⚠️</div>
        <h2 className="text-xl font-semibold mb-2">Unable to open this item</h2>
        <p className="text-gray-600 mb-6">This media could not be loaded. Please try another item.</p>
        <button
          type="button"
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  )

  if (!current) {
    return renderErrorModal()
  }

  const getCategoryDisplay = (category: string) => {
    const categoryMap = {
      'classroom': { icon: '📚', name: 'Classroom Learning' },
      'activities': { icon: '🎮', name: 'Interactive Activities' },
      'outcomes': { icon: '🏆', name: 'Learning Outcomes' }
    }
    return categoryMap[category as keyof typeof categoryMap] || { icon: '📷', name: 'Media' }
  }

  const categoryInfo = getCategoryDisplay(current.category)

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={current.title}
      onClick={onClose}
    >
      <div className="relative max-w-6xl w-full h-full flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Top Bar */}
        <div className="flex items-center justify-between text-white mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{categoryInfo.icon}</span>
            <div>
              <div className="text-sm opacity-75">{categoryInfo.name}</div>
              <div className="text-xs opacity-50">{currentIndex + 1} of {items.length}</div>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close"
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            onClick={onClose}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center relative">
          {/* Media Display */}
          <div className="relative max-w-full max-h-full">
            {current.type === 'video' ? (
              <video
                controls
                playsInline
                className="max-w-full max-h-[70vh] rounded-lg bg-black"
                poster={current.thumbnailUrl || '/media/placeholder-image.svg'}
                preload="metadata"
                onError={(e) => {
                  const container = (e.currentTarget.parentElement as HTMLElement)
                  if (!container) return
                  // Replace failed video with an image fallback
                  container.innerHTML = `<img src="${current.thumbnailUrl || '/media/placeholder-image.svg'}" alt="${current.title}" class="max-w-full max-h-[70vh] object-contain rounded-lg" />`
                }}
              >
                <source src={current.imageUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={current.imageUrl}
                alt={current.title}
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement & { dataset: { fallbackApplied?: string } }
                  if (img.dataset.fallbackApplied === 'true') return
                  img.dataset.fallbackApplied = 'true'
                  img.src = '/media/placeholder-image.svg'
                }}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            )}

            {/* Featured Badge */}
            {current.featured && (
              <div className="absolute top-4 left-4">
                <span className="bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                  ⭐ Featured
                </span>
              </div>
            )}
          </div>

          {/* Navigation Arrows */}
          {items.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous"
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                onClick={onPrev}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Next"
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                onClick={onNext}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Bottom Info Panel */}
        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 text-white mt-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h2 className="text-xl font-semibold">{current.title}</h2>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  current.type === 'video' 
                    ? 'bg-red-500/20 text-red-300' 
                    : 'bg-green-500/20 text-green-300'
                }`}>
                  {current.type === 'video' ? '🎬 Video' : '📸 Photo'}
                </span>
              </div>
              <p className="text-gray-300 mb-3 leading-relaxed">
                {current.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {current.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-white/10 text-white/90"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="ml-6 flex-shrink-0">
              <img
                src={current.thumbnailUrl || '/media/placeholder-image.svg'}
                alt=""
                className="w-20 h-20 object-cover rounded-lg opacity-60"
                onError={(e) => {
                  const img = e.currentTarget
                  img.src = '/media/placeholder-image.svg'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Lightbox