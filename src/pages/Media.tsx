import { useMemo, useState, useCallback } from 'react'
import Gallery from '../components/media/Gallery'
import Lightbox from '../components/media/Lightbox'
import { mediaItems } from '../data/media'

const Media = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Tags placeholder (structure ready)
  const allTags = useMemo(() => {
    const set = new Set<string>()
    mediaItems.forEach(i => i.tags.forEach(t => set.add(t)))
    return Array.from(set)
  }, [])

  const [activeTag, setActiveTag] = useState<string | 'all'>('all')

  const filteredItems = useMemo(() => {
    if (activeTag === 'all') return mediaItems
    return mediaItems.filter(i => i.tags.includes(activeTag))
  }, [activeTag])

  const openAt = useCallback((index: number) => {
    setCurrentIndex(index)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => setIsOpen(false), [])

  const prev = useCallback(() => {
    setCurrentIndex(prevIndex => (prevIndex - 1 + filteredItems.length) % filteredItems.length)
  }, [filteredItems.length])

  const next = useCallback(() => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % filteredItems.length)
  }, [filteredItems.length])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Media</h1>
      <p className="text-gray-600 mb-6">Photos and videos from our workshops and events.</p>

      {/* Tag filter (optional) */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          type="button"
          onClick={() => setActiveTag('all')}
          className={`px-3 py-1 rounded-full text-sm border ${activeTag === 'all' ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-300'}`}
          aria-pressed={activeTag === 'all'}
          aria-label="Show all"
        >
          All
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            type="button"
            onClick={() => setActiveTag(tag)}
            className={`px-3 py-1 rounded-full text-sm border ${activeTag === tag ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-300'}`}
            aria-pressed={activeTag === tag}
            aria-label={`Filter ${tag}`}
          >
            {tag}
          </button>
        ))}
      </div>

      <Gallery items={filteredItems} onItemClick={openAt} />

      {isOpen && (
        <Lightbox
          items={filteredItems}
          currentIndex={currentIndex}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </div>
  )
}

export default Media


