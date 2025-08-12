import { useMemo, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { workshops } from '../data/workshops'

const WorkshopDetail = () => {
  const { id } = useParams<{ id: string }>()
  const item = useMemo(() => workshops.find((w) => w.slug === id), [id])

  useEffect(() => {
    if (item?.seo?.title) document.title = item.seo.title
    if (item?.seo?.description) {
      const meta = document.querySelector('meta[name="description"]')
      if (meta) meta.setAttribute('content', item.seo.description)
    }
  }, [item])

  if (!item) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Workshop Not Found</h1>
          <Link to="/workshops" className="btn-primary">Back to Workshops</Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/workshops" className="text-primary-700 hover:underline">← Back to Workshops</Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 leading-tight">{item.title}</h1>
          {item.subtitle && <div className="mt-2 text-primary-700 font-medium">{item.subtitle}</div>}
          <div className="mt-3 text-gray-600">{item.targetAudience} • {item.duration}</div>
          <p className="mt-6 text-base md:text-lg text-gray-700 max-w-3xl">{item.overview}</p>
        </div>
      </section>

      {/* Outcomes & Outline */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Learning Outcomes</h2>
            <ul className="space-y-3 list-disc pl-6 text-gray-700">
              {item.learningOutcomes.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Workshop Outline</h2>
            <div className="space-y-5">
              {item.syllabus.map((s) => (
                <div key={s.week} className="p-5 border border-gray-200 rounded-xl">
                  <div className="font-semibold text-gray-900 mb-1">Week {s.week}: {s.title}</div>
                  <div className="text-sm text-gray-600 mb-2">Objective: {s.objective}</div>
                  <ul className="list-disc pl-5 text-gray-700 space-y-1">
                    {s.activities.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Materials */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 border border-gray-200 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-2">Hardware</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              {item.materials.hardware.map((m) => (<li key={m}>{m}</li>))}
            </ul>
          </div>
          <div className="p-5 border border-gray-200 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-2">Software</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              {item.materials.software.map((m) => (<li key={m}>{m}</li>))}
            </ul>
          </div>
          <div className="p-5 border border-gray-200 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-2">Online Resources</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              {item.materials.onlineResources.map((m) => (<li key={m}>{m}</li>))}
            </ul>
          </div>
        </div>
      </section>

      {/* Assessment */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Assessment</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {item.assessment.map((a) => (
              <div key={a.item} className="p-5 border border-gray-200 rounded-xl bg-white">
                <div className="font-semibold text-gray-900">{a.item}</div>
                <div className="text-sm text-gray-600">Weight: {a.weight}</div>
                {a.criteria && (<div className="text-sm text-gray-700 mt-2">{a.criteria}</div>)}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {item.media?.video && (
            <figure>
              <video controls poster={item.media.video.poster} className="w-full rounded-xl shadow-sm">
                <source src={item.media.video.src} />
              </video>
              {item.media.video.caption && (
                <figcaption className="text-sm text-gray-600 mt-2">{item.media.video.caption}</figcaption>
              )}
            </figure>
          )}
          {item.media?.photos && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {item.media.photos.map((p) => (
                <div key={p.src} className="relative overflow-hidden rounded-xl aspect-[4/3] bg-gray-100">
                  <img src={p.src} alt={p.alt || 'workshop'} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Bring this workshop to your school</h2>
          <p className="text-primary-100 max-w-2xl mx-auto mb-8">We tailor content to suit your class size, schedule, and learning goals.</p>
          <Link to={`/book?workshop=${item.id}`} className="bg-white text-primary-600 hover:bg-gray-50 font-semibold text-lg px-8 py-3 rounded-lg inline-block no-underline">
            Book This Workshop
          </Link>
        </div>
      </section>
    </div>
  )
}

export default WorkshopDetail

