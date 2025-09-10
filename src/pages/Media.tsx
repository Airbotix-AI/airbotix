import { useState, useCallback, useEffect, useRef } from 'react'
import Gallery from '../components/media/Gallery'
import Lightbox from '../components/media/Lightbox'
import { pacificCampMedia } from '../data/media'

const Media = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  // Category filter (All / Classroom / Activities / Outcomes)

  // Scroll reveal utility
  const revealRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const el = revealRef.current
    if (!el) return
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('show') } })
    }, { threshold: 0.1 })
    el.querySelectorAll('.reveal').forEach((n) => obs.observe(n))
    return () => obs.disconnect()
  }, [])

  // Filter media content
  // Render all categories in sections; tabs act as in-page anchors
  const allItems = pacificCampMedia
  const classroomItems = allItems.filter(i => i.category === 'classroom')
  const activityItems = allItems.filter(i => i.category === 'activities')
  const outcomeItems = allItems.filter(i => i.category === 'outcomes')

  const openAt = useCallback((index: number) => { setCurrentIndex(index); setIsOpen(true) }, [])
  const close = useCallback(() => setIsOpen(false), [])
  const prev = useCallback(() => { setCurrentIndex(prevIndex => (prevIndex - 1 + allItems.length) % allItems.length) }, [allItems.length])
  const next = useCallback(() => { setCurrentIndex(prevIndex => (prevIndex + 1) % allItems.length) }, [allItems.length])

  // Group by category for structured layout
  // No grouping – keep layout minimal and elegant

  // Get featured image for Hero display
  const featuredImage = pacificCampMedia.find(item => item.featured) || pacificCampMedia[0]

  // Section refs for smooth anchor scrolling
  const classroomRef = useRef<HTMLElement | null>(null)
  const activitiesRef = useRef<HTMLElement | null>(null)
  const outcomesRef = useRef<HTMLElement | null>(null)

  const scrollTo = (ref: React.RefObject<HTMLElement>) => {
    const el = ref.current
    if (!el) return
    const y = el.getBoundingClientRect().top + window.scrollY - 90 // offset for sticky tabs
    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50" ref={revealRef}>
      {/* Hero Section */}
      <section className="relative h-[48vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={featuredImage.imageUrl}
            alt="Pacific Camp 2025"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="w-full h-full object-cover opacity-40"
            onError={(e) => { (e.target as HTMLImageElement).src = '/media/placeholder-image.svg' }}
          />
          <div className="absolute inset-0 bg-animated-gradient opacity-35 mix-blend-multiply" />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute -top-20 -left-20 w-[50vw] h-[50vw] rounded-full blob-gradient opacity-70" />
          <div className="absolute -bottom-24 -right-24 w-[40vw] h-[40vw] rounded-full blob-gradient opacity-60" />
        </div>
        <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
          <div className="max-w-4xl reveal">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 drop-shadow">🏕️ Pacific Camp 2025</h1>
            <p className="text-xl md:text-2xl font-light mb-2">Airbotix Educational Experience Camp</p>
            <p className="text-lg md:text-xl/relaxed text-white/90">AI and Technology Learning Journey Combining Education with Fun</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Sticky anchor tabs (no routing, smooth scroll) */}
        <div className="reveal mb-6 sticky top-4 z-20">
          <div className="flex justify-center">
            <div className="flex space-x-1 bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-md">
              <button onClick={() => scrollTo(classroomRef)} className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">📚 Classroom</button>
              <button onClick={() => scrollTo(activitiesRef)} className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">🎮 Activities</button>
              <button onClick={() => scrollTo(outcomesRef)} className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">🏆 Outcomes</button>
            </div>
          </div>
        </div>

        {/* Grouped sections */}
        {classroomItems.length > 0 && (
          <section id="classroom" ref={classroomRef} className="reveal mb-14 scroll-mt-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2"><span>📚</span> Classroom Learning</h2>
              <span className="text-sm text-gray-500">{classroomItems.length} items</span>
            </div>
            <Gallery items={classroomItems} onItemClick={(i) => {
              const id = classroomItems[i].id
              const absolute = allItems.findIndex(it => it.id === id)
              openAt(absolute >= 0 ? absolute : 0)
            }} />
          </section>
        )}

        {activityItems.length > 0 && (
          <section id="activities" ref={activitiesRef} className="reveal mb-14 scroll-mt-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2"><span>🎮</span> Interactive Activities</h2>
              <span className="text-sm text-gray-500">{activityItems.length} items</span>
            </div>
            <Gallery items={activityItems} onItemClick={(i) => {
              const id = activityItems[i].id
              const absolute = allItems.findIndex(it => it.id === id)
              openAt(absolute >= 0 ? absolute : 0)
            }} />
          </section>
        )}

        {outcomeItems.length > 0 && (
          <section id="outcomes" ref={outcomesRef} className="reveal scroll-mt-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2"><span>🏆</span> Learning Outcomes</h2>
              <span className="text-sm text-gray-500">{outcomeItems.length} items</span>
            </div>
            <Gallery items={outcomeItems} onItemClick={(i) => {
              const id = outcomeItems[i].id
              const absolute = allItems.findIndex(it => it.id === id)
              openAt(absolute >= 0 ? absolute : 0)
            }} />
          </section>
        )}

        {/* Stats Section */}
        <div className="mt-16 bg-white rounded-xl shadow-sm p-8 reveal">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">{pacificCampMedia.filter(item => item.category === 'classroom').length}</div>
              <div className="text-gray-600">Classroom Teaching Scenarios</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary-600 mb-2">{pacificCampMedia.filter(item => item.category === 'activities').length}</div>
              <div className="text-gray-600">Interactive Activity Experiences</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent-600 mb-2">{pacificCampMedia.filter(item => item.category === 'outcomes').length}</div>
              <div className="text-gray-600">Learning Achievement Showcases</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center reveal">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Experience Airbotix Innovative Education</h2>
            <p className="text-xl mb-6 text-white/90">Join our next educational experience camp and start your AI and technology learning journey</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="bg-white text-primary-600 hover:bg-gray-50 font-semibold px-8 py-3 rounded-lg transition-colors">Contact Us</a>
              <a href="/book" className="bg-primary-700 text-white hover:bg-primary-800 font-semibold px-8 py-3 rounded-lg transition-colors">Book Experience</a>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {isOpen && (
        <Lightbox
          items={allItems}
          currentIndex={currentIndex}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </div>
  )}

export default Media