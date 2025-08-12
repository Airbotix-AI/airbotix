import { Link } from 'react-router-dom'
import { workshops as data } from '../data/workshops'

const Workshops = () => {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Workshops</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Engaging, curriculum-aligned AI & Robotics workshops designed for K-12 students across Australia.
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.map((ws) => (
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
                      View Details
                    </Link>
                    <Link to={`/book?workshop=${ws.slug}`} className="btn-primary w-full sm:w-auto">
                      Book
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Bring Airbotix to your school</h2>
          <p className="text-primary-100 max-w-2xl mx-auto mb-8">
            Tailored programs for different age groups, class sizes, and learning objectives.
          </p>
          <button className="bg-white text-primary-600 hover:bg-gray-50 font-semibold text-lg px-8 py-3 rounded-lg transition-colors">
            Contact Us
          </button>
        </div>
      </section>
    </div>
  )
}

export default Workshops

