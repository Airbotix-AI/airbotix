import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { workshops as data } from '../data/workshops'

// File-level constants to avoid magic strings
const WORKSHOP_FILTERS = {
  ALL: 'all',
  ONE_DAY: '1d',
  TWO_DAY: '2d',
  THREE_DAY: '3d',
  OTHER: 'other',
} as const

const WORKSHOP_TEXTS = {
  PAGE_TITLE: 'Workshops',
  PAGE_DESC: 'See our past workshops, designed with flexibility to meet your needs.',
  FILTER_ALL: 'All',
  FILTER_1D: '1 day',
  FILTER_2D: '2 day',
  FILTER_3D: '3 day',
  FILTER_OTHER: 'Other',
  VIEW_DETAILS: 'View Details',
  BOOK: 'Book',
  EMPTY_TITLE: 'No workshops match your filter',
  EMPTY_DESC: 'Try adjusting the duration filter or check back soon for new programs.',
  CLEAR_FILTERS: 'Clear filters',
  CTA_TITLE: 'Bring Airbotix to your school',
  CTA_DESC: 'Tailored programs for different age groups, class sizes, and learning objectives.',
  CTA_CONTACT: 'Contact Us',
} as const

type DurationFilter = typeof WORKSHOP_FILTERS[keyof typeof WORKSHOP_FILTERS]

const deriveDurationFilter = (duration: string): Exclude<DurationFilter, 'all'> => {
  const match = duration.toLowerCase().match(/\b(\d+)\s*day/)
  if (match) {
    const num = parseInt(match[1], 10)
    if (num === 1) return WORKSHOP_FILTERS.ONE_DAY
    if (num === 2) return WORKSHOP_FILTERS.TWO_DAY
    if (num === 3) return WORKSHOP_FILTERS.THREE_DAY
  }
  return WORKSHOP_FILTERS.OTHER
}

const Workshops = () => {
  const [selectedDuration, setSelectedDuration] = useState<DurationFilter>(WORKSHOP_FILTERS.ALL)

  const filtered = useMemo(() => {
    if (selectedDuration === WORKSHOP_FILTERS.ALL) return data
    return data.filter((ws) => deriveDurationFilter(ws.duration) === selectedDuration)
  }, [selectedDuration])

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{WORKSHOP_TEXTS.PAGE_TITLE}</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {WORKSHOP_TEXTS.PAGE_DESC}
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {[
              { key: WORKSHOP_FILTERS.ALL, label: WORKSHOP_TEXTS.FILTER_ALL },
              { key: WORKSHOP_FILTERS.ONE_DAY, label: WORKSHOP_TEXTS.FILTER_1D },
              { key: WORKSHOP_FILTERS.TWO_DAY, label: WORKSHOP_TEXTS.FILTER_2D },
              { key: WORKSHOP_FILTERS.THREE_DAY, label: WORKSHOP_TEXTS.FILTER_3D },
              { key: WORKSHOP_FILTERS.OTHER, label: WORKSHOP_TEXTS.FILTER_OTHER },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setSelectedDuration(f.key as DurationFilter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedDuration === f.key
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{WORKSHOP_TEXTS.EMPTY_TITLE}</h3>
                <p className="text-gray-600 mb-6">{WORKSHOP_TEXTS.EMPTY_DESC}</p>
                {selectedDuration !== WORKSHOP_FILTERS.ALL && (
                  <button
                    onClick={() => setSelectedDuration(WORKSHOP_FILTERS.ALL)}
                    className="btn-primary"
                  >
                    {WORKSHOP_TEXTS.CLEAR_FILTERS}
                  </button>
                )}
              </div>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((ws) => (
              <div key={ws.slug} className="border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 max-w-[65%] line-clamp-3">
                    <Link
                      to={`/workshops/${ws.slug}`}
                      className="hover:text-primary-700 focus:underline outline-none"
                      aria-label={`View details for ${ws.title}`}
                    >
                      {ws.title}
                    </Link>
                  </h3>
                  <span className="text-xs sm:text-sm text-primary-700 bg-primary-50 px-2 py-1 rounded-full font-medium max-w-[35%] line-clamp-2 text-center">
                    {ws.targetAudience || 'All levels'}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-4">{ws.overview}</p>
                {ws.highlights && (
                  <ul className="space-y-2 mb-6 list-disc pl-5 text-gray-700">
                    {ws.highlights.map((item) => (
                      <li key={item} className="line-clamp-2">{item}</li>
                    ))}
                  </ul>
                )}
                <div className="mt-auto space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg
                      className="w-4 h-4 mr-2 text-gray-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M8 2v3M16 2v3M3 9h18M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="line-clamp-2">{ws.duration}</span>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Link to={`/workshops/${ws.slug}`} className="btn-outline w-full sm:w-auto text-center">
                      {WORKSHOP_TEXTS.VIEW_DETAILS}
                    </Link>
                    <Link to={`/book?workshop=${ws.slug}`} className="btn-primary w-full sm:w-auto">
                      {WORKSHOP_TEXTS.BOOK}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{WORKSHOP_TEXTS.CTA_TITLE}</h2>
          <p className="text-primary-100 max-w-2xl mx-auto mb-8">
            {WORKSHOP_TEXTS.CTA_DESC}
          </p>
          <Link to="/contact" className="bg-white text-primary-600 hover:bg-gray-50 font-semibold text-lg px-8 py-3 rounded-lg transition-colors inline-block">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Workshops

