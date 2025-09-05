import { useState, useCallback } from 'react'
import Gallery from '../components/media/Gallery'
import Lightbox from '../components/media/Lightbox'
import { pacificCampMedia, mediaCategories, MediaItem } from '../data/media'

const Media = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [activeCategory, setActiveCategory] = useState<string>('all')

  // Filter media content
  const filteredItems = activeCategory === 'all' 
    ? pacificCampMedia 
    : pacificCampMedia.filter(item => item.category === activeCategory)

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

  // Get featured image for Hero display
  const featuredImage = pacificCampMedia.find(item => item.featured) || pacificCampMedia[0]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[40vh] bg-gradient-to-br from-primary-600 to-secondary-600 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={featuredImage.imageUrl}
            alt="Pacific Camp 2025"
            className="w-full h-full object-cover opacity-30"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/media/placeholder-image.svg';
            }}
          />
        </div>
        <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              🏕️ Pacific Camp 2025
            </h1>
            <p className="text-xl md:text-2xl font-light mb-2">
              Airbotix Educational Experience Camp
            </p>
            <p className="text-lg md:text-xl opacity-90">
              AI and Technology Learning Journey Combining Education with Fun
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Tabs Navigation */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-md">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeCategory === 'all'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                🎯 All Content
              </button>
              {mediaCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeCategory === category.id
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  {category.icon} {category.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Category Description */}
          {activeCategory !== 'all' && (
            <div className="text-center mt-4">
              <p className="text-gray-600">
                {mediaCategories.find(cat => cat.id === activeCategory)?.description}
              </p>
            </div>
          )}
        </div>

        {/* Gallery Grid */}
        <Gallery items={filteredItems} onItemClick={openAt} />

        {/* Stats Section */}
        <div className="mt-16 bg-white rounded-xl shadow-sm p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {pacificCampMedia.filter(item => item.category === 'classroom').length}
              </div>
              <div className="text-gray-600">Classroom Teaching Scenarios</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary-600 mb-2">
                {pacificCampMedia.filter(item => item.category === 'activities').length}
              </div>
              <div className="text-gray-600">Interactive Activity Experiences</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent-600 mb-2">
                {pacificCampMedia.filter(item => item.category === 'outcomes').length}
              </div>
              <div className="text-gray-600">Learning Achievement Showcases</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Experience Airbotix Innovative Education
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Join our next educational experience camp and start your AI and technology learning journey
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white text-primary-600 hover:bg-gray-50 font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                Contact Us
              </a>
              <a
                href="/book"
                className="bg-primary-700 text-white hover:bg-primary-800 font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                Book Experience
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
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