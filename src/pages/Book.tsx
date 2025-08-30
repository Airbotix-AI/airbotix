import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

type BookingForm = {
  workshopId: string
  organization: string
  contactName: string
  email: string
  phone: string
  preferredDate: string
  location: string
  studentsCount: string
  gradeRange: string
  notes: string
}

const emptyForm: BookingForm = {
  workshopId: '',
  organization: '',
  contactName: '',
  email: '',
  phone: '',
  preferredDate: '',
  location: '',
  studentsCount: '',
  gradeRange: '',
  notes: '',
}

const Book = () => {
  const [params] = useSearchParams()
  const [form, setForm] = useState<BookingForm>(emptyForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const formspreeId = import.meta.env.VITE_FORMSPREE_BOOK_ID as string | undefined
  const fallbackEmail = import.meta.env.VITE_CONTACT_EMAIL as string | undefined

  useEffect(() => {
    const w = params.get('workshop') || ''
    setForm((prev) => ({ ...prev, workshopId: w }))
  }, [params])

  const isValidEmail = useMemo(() => /.+@.+\..+/, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const validate = (): string | null => {
    if (!form.contactName.trim()) return 'Please enter a contact name'
    if (!form.email.trim() || !isValidEmail.test(form.email)) return 'Please enter a valid email'
    if (!form.organization.trim()) return 'Please enter your organization/school'
    if (!form.workshopId.trim()) return 'Please choose a workshop'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMessage('')
    setErrorMessage('')
    const validationError = validate()
    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        workshopId: form.workshopId,
        organization: form.organization,
        contactName: form.contactName,
        email: form.email,
        phone: form.phone,
        preferredDate: form.preferredDate,
        location: form.location,
        studentsCount: form.studentsCount,
        gradeRange: form.gradeRange,
        notes: form.notes,
      }

      if (formspreeId) {
        const endpoint = `https://formspree.io/f/${formspreeId}`
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        })
        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data?.error || 'Failed to submit booking request')
        }
        setSuccessMessage('Thanks! Your booking request has been sent.')
        setForm(emptyForm)
      } else if (fallbackEmail) {
        const mailto = new URL(`mailto:${fallbackEmail}`)
        mailto.searchParams.set(
          'subject',
          `Workshop Booking Request: ${form.workshopId || 'General'}`
        )
        const bodyLines = [
          `Workshop: ${form.workshopId}`,
          `Organization: ${form.organization}`,
          `Contact: ${form.contactName}`,
          `Email: ${form.email}`,
          `Phone: ${form.phone}`,
          `Preferred Date: ${form.preferredDate}`,
          `Location: ${form.location}`,
          `Students: ${form.studentsCount}`,
          `Grade Range: ${form.gradeRange}`,
          '',
          form.notes,
        ]
        mailto.searchParams.set('body', bodyLines.join('\n'))
        window.location.href = mailto.toString()
        setSuccessMessage('Opening your email client...')
      } else {
        throw new Error('No booking endpoint configured. Set VITE_FORMSPREE_BOOK_ID or VITE_CONTACT_EMAIL')
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Something went wrong. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Book a Workshop</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Tell us a few details and we’ll get back to you to confirm availability and next steps.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 md:p-8 border border-gray-200 rounded-2xl shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Workshop</label>
                  <input
                    name="workshopId"
                    value={form.workshopId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="e.g., ai-intro"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization / School</label>
                  <input
                    name="organization"
                    value={form.organization}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Your school or organization"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                  <input
                    name="contactName"
                    value={form.contactName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Mobile or landline"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                  <input
                    name="preferredDate"
                    type="date"
                    value={form.preferredDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location (City/Suburb)</label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="e.g., Melbourne"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Students</label>
                  <input
                    name="studentsCount"
                    value={form.studentsCount}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Approx. number of students"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grade Range</label>
                <input
                  name="gradeRange"
                  value={form.gradeRange}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="e.g., Grades 5-6"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <textarea
                  name="notes"
                  rows={6}
                  value={form.notes}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Anything else we should know (equipment, accessibility, objectives, etc.)"
                />
              </div>

              {errorMessage && (
                <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{errorMessage}</div>
              )}
              {successMessage && (
                <div className="text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">{successMessage}</div>
              )}

              <div className="flex justify-end">
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
                </button>
              </div>
            </form>
            {!formspreeId && (
              <p className="text-xs text-gray-500 mt-4">
                Tip: Set <code>VITE_FORMSPREE_BOOK_ID</code> in your environment to enable direct submissions.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Book

