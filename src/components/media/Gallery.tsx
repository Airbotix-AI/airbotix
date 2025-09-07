import { MediaItem } from '../../types'

interface GalleryProps {
  items: MediaItem[]
  onItemClick: (index: number) => void
}

const Gallery = ({ items, onItemClick }: GalleryProps) => {
  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget
    if ((target as any).dataset.fallbackApplied === 'true') return
    ;(target as any).dataset.fallbackApplied = 'true'
    target.src = '/media/placeholder-image.svg'
  }

  const getThumbSrc = (item: MediaItem): string => {
    if (item.thumbnailUrl) return item.thumbnailUrl
    if (item.type === 'photo') {
      return item.imageUrl.replace('/photos/', '/photos/thumbs/')
    }
    try {
      const parts = item.imageUrl.split('/')
      const filename = parts[parts.length - 1] || ''
      const base = filename.replace(/\.[^/.]+$/, '')
      return '/media/pacific-camp/photos/thumbs/' + base + '.jpg'
    } catch {
      return '/media/placeholder-image.svg'
    }
  }

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rx = ((y / rect.height) - 0.5) * -6 // rotateX
    const ry = ((x / rect.width) - 0.5) * 6  // rotateY
    el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`
  }

  const handleLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = e.currentTarget
    el.style.transform = ''
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📷</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Content Available</h3>
        <p className="text-gray-500">No media content available in this category</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item, index) => (
        <button
          key={item.id}
          type="button"
          className="group text-left rounded-2xl bg-white/90 backdrop-blur-sm shadow-sm overflow-hidden transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 hover:shadow-2xl"
          style={{ transformStyle: 'preserve-3d' }}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          onClick={() => onItemClick(index)}
        >
          <div className="relative bg-gray-100 aspect-[4/3]">
            <div className="pointer-events-none absolute -inset-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl blob-gradient" />
            <img
              src={getThumbSrc(item)}
              alt={item.title}
              loading="lazy"
              onError={handleImgError}
              className="absolute inset-0 m-auto max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
            />

            {item.type === 'video' && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white/90 rounded-full p-3 backdrop-blur-sm glow-soft">
                  <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}

            {/* featured badge removed per request */}

            {item.type === 'video' && (
              <div className="absolute top-3 right-3">
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-700">
                  🎬 Video
                </span>
              </div>
            )}
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">{item.title}</h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
            <div className="flex flex-wrap gap-1">
              {item.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                  #{tag}
                </span>
              ))}
              {item.tags.length > 3 && (
                <span className="text-xs text-gray-400">+{item.tags.length - 3} more</span>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

export default Gallery