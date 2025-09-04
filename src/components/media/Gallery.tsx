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
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item, index) => (
        <button
          key={item.id}
          type="button"
          aria-label={`Open ${item.title}`}
          className="group relative block focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg overflow-hidden"
          onClick={() => onItemClick(index)}
        >
          {/* Thumbnail */}
          <div className="aspect-[4/3] w-full bg-gray-100 overflow-hidden">
            {item.type === 'image' ? (
              <img
                src={item.thumbnailUrl ?? item.url}
                alt={item.title}
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={handleImgError}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="relative h-full w-full">
                <img
                  src={item.thumbnailUrl ?? '/media/placeholder-video.svg'}
                  alt={item.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={handleImgError}
                  className="h-full w-full object-cover"
                />
                {/* Play icon overlay */}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-12 h-12 text-white drop-shadow"
                    aria-hidden="true"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Caption */}
          <div className="p-2 text-left">
            <div className="text-sm font-medium text-gray-900 truncate">{item.title}</div>
          </div>
        </button>
      ))}
    </div>
  )
}

export default Gallery


