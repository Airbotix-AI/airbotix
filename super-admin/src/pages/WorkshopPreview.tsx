import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { workshopService } from '@/services'
import type { Workshop } from '@/types/workshop'

interface WorkshopPreviewProps {
  workshop?: Workshop
  onClose?: () => void
  asDialog?: boolean
}

export default function WorkshopPreview(props: WorkshopPreviewProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()
  const [workshop, setWorkshop] = useState<Workshop | null>(props.workshop ?? null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleBack = () => {
    // Prefer history back to preserve previous page state (e.g., form draft)
    // Fallback to workshops list if no history entry
    if (window.history && window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/admin/workshops')
    }
  }

  useEffect(() => {
    if (props.workshop) {
      setLoading(false)
      setError(null)
      return
    }
    const state = location.state as { workshop?: Workshop } | undefined
    if (state?.workshop) {
      setWorkshop(state.workshop)
      setLoading(false)
      return
    }
    const load = async () => {
      if (!id) {
        setLoading(false)
        setError('Missing workshop identifier')
        return
      }
      setLoading(true)
      const res = await workshopService.getById(id)
      if (!res.success || !res.data) {
        setError(res.error || 'Failed to load workshop')
      } else {
        setWorkshop(res.data.workshop)
      }
      setLoading(false)
    }
    load()
  }, [id, location.state, props.workshop])

  useEffect(() => {
    if (workshop?.seo?.title) document.title = workshop.seo.title
  }, [workshop?.seo?.title])

  const item = useMemo(() => workshop, [workshop])

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Workshop Not Found</h1>
          {props.asDialog ? (
            <button onClick={props.onClose} className="btn-primary">Close</button>
          ) : (
            <button onClick={() => navigate('/admin/workshops')} className="btn-primary">Back to Workshops</button>
          )}
        </div>
      </div>
    )
  }

  const content = (
    <div>
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {props.asDialog ? (
            <button onClick={props.onClose} className="text-primary-700 hover:underline">× Close</button>
          ) : (
            <button onClick={handleBack} className="text-primary-700 hover:underline">← Back</button>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 leading-tight">{item.title}</h1>
          {item.subtitle && <div className="mt-2 text-primary-700 font-medium">{item.subtitle}</div>}
          <div className="mt-3 text-gray-600">{item.targetAudience} • {item.duration}</div>
          <p className="mt-6 text-base md:text-lg text-gray-700 max-w-3xl">{item.overview}</p>
        </div>
      </section>

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
                <div key={s.day} className="p-5 border border-gray-200 rounded-xl">
                  <div className="font-semibold text-gray-900 mb-1">Day {s.day}: {s.title}</div>
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
    </div>
  )

  if (props.asDialog) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={props.onClose} />
        <div className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl">
          {content}
        </div>
      </div>
    )
  }

  return content
}


