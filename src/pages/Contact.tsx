import { useState } from 'react'

type FormState = {
  fullName: string
  email: string
  subject: string
  message: string
}

const initialState: FormState = {
  fullName: '',
  email: '',
  subject: '',
  message: '',
}

const Contact = () => {
  const [form, setForm] = useState<FormState>(initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const formspreeId = import.meta.env.VITE_FORMSPREE_ID as string | undefined
  const fallbackEmail = import.meta.env.VITE_CONTACT_EMAIL as string | undefined

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const validate = (): string | null => {
    if (!form.fullName.trim()) return 'Please enter your full name'
    if (!form.email.trim()) return 'Please enter your email address'
    // Simple email check
    const emailOk = /.+@.+\..+/.test(form.email)
    if (!emailOk) return 'Please enter a valid email address'
    if (!form.message.trim()) return 'Please enter a message'
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
      if (formspreeId) {
        const endpoint = `https://formspree.io/f/${formspreeId}`
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name: form.fullName,
            email: form.email,
            subject: form.subject,
            message: form.message,
          }),
        })

        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data?.error || 'Failed to send message')
        }

        setSuccessMessage('Thank you! Your message has been sent.')
        setForm(initialState)
      } else if (fallbackEmail) {
        // Fallback to mailto
        const mailto = new URL(`mailto:${fallbackEmail}`)
        const subject = form.subject || 'New Contact Message from Airbotix Website'
        const body = `Name: ${form.fullName}\nEmail: ${form.email}\n\n${form.message}`
        mailto.searchParams.set('subject', subject)
        mailto.searchParams.set('body', body)
        window.location.href = mailto.toString()
        setSuccessMessage('Opening your email client...')
      } else {
        throw new Error(
          'No form endpoint configured. Please set VITE_FORMSPREE_ID or VITE_CONTACT_EMAIL.'
        )
      }
    } catch (err) {
      setErrorMessage((err as Error)?.message || 'Something went wrong. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Have a question or want to book a workshop? Send us a message and we’ll get back to you shortly.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 md:p-8 border border-gray-200 rounded-2xl shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={form.fullName}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject (optional)
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={form.message}
                  onChange={handleChange}
                  className="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                  placeholder="Tell us about your needs, preferred dates, class size, etc."
                  required
                />
              </div>

              {errorMessage && (
                <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  {errorMessage}
                </div>
              )}
              {successMessage && (
                <div className="text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                  {successMessage}
                </div>
              )}

              <div className="flex justify-end">
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
            {!formspreeId && (
              <p className="text-xs text-gray-500 mt-4">
                Tip: Set <code>VITE_FORMSPREE_ID</code> in your environment to enable direct submissions without opening an email client.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact

