import { MediaItem } from '../../data/media'

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
    <div className="masonry-grid">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="masonry-item group cursor-pointer"
          onClick={() => onItemClick(index)}
        >
          <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={item.thumbnailUrl}
                alt={item.title}
                loading="lazy"
                onError={handleImgError}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              
              {/* Video Play Overlay */}
              {item.type === 'video' && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white/90 rounded-full p-3 backdrop-blur-sm">
                    <svg
                      className="w-6 h-6 text-primary-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Featured Badge */}
              {item.featured && (
                <div className="absolute top-3 left-3">
                  <span className="bg-primary-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                    ⭐ Featured
                  </span>
                </div>
              )}

              {/* Type Badge */}
              <div className="absolute top-3 right-3">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  item.type === 'video' 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {item.type === 'video' ? '🎬 Video' : '📸 Photo'}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {item.description}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {item.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                  >
                    #{tag}
                  </span>
                ))}
                {item.tags.length > 3 && (
                  <span className="text-xs text-gray-400">
                    +{item.tags.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Masonry CSS */}
      <style jsx>{`
        .masonry-grid {
          columns: 1;
          column-gap: 1.5rem;
          padding: 0;
        }
        
        @media (min-width: 640px) {
          .masonry-grid {
            columns: 2;
          }
        }
        
        @media (min-width: 1024px) {
          .masonry-grid {
            columns: 3;
          }
        }
        
        @media (min-width: 1280px) {
          .masonry-grid {
            columns: 4;
          }
        }
        
        .masonry-item {
          break-inside: avoid;
          margin-bottom: 1.5rem;
          display: inline-block;
          width: 100%;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}

export default Gallery