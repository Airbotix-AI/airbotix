import { useState } from 'react'
import { faqCategories } from '../data/faq'

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState(faqCategories[0]?.id || '')
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  const toggleItem = (questionId: string) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(questionId)) {
      newOpenItems.delete(questionId)
    } else {
      newOpenItems.add(questionId)
    }
    setOpenItems(newOpenItems)
  }

  const activeData = faqCategories.find(cat => cat.id === activeCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Find answers to common questions about our AI and robotics programs
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Category Navigation */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                <nav className="space-y-2">
                  {faqCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        activeCategory === category.id
                          ? 'bg-primary-100 text-primary-700 border border-primary-200'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-3">{category.icon}</span>
                      {category.title}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* FAQ Items */}
            <div className="lg:col-span-3">
              {activeData && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="mr-3 text-3xl">{activeData.icon}</span>
                    {activeData.title}
                  </h2>
                  <div className="space-y-4">
                    {activeData.items.map((item, index) => {
                      const itemId = `${activeCategory}-${index}`
                      const isOpen = openItems.has(itemId)
                      
                      return (
                        <div
                          key={itemId}
                          className="bg-white rounded-lg border border-gray-200 shadow-sm"
                        >
                          <button
                            onClick={() => toggleItem(itemId)}
                            className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                          >
                            <span className="font-medium text-gray-900 pr-4">
                              {item.question}
                            </span>
                            <svg
                              className={`w-5 h-5 text-gray-500 transition-transform ${
                                isOpen ? 'rotate-180' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          {isOpen && (
                            <div className="px-6 pb-4">
                              <div className="border-t border-gray-100 pt-4">
                                <p className="text-gray-600 leading-relaxed">
                                  {item.answer}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Have More Questions?
          </h2>
          <p className="text-primary-100 mb-8">
            Our team is here to help you find the perfect program for your child
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-primary-600 hover:bg-gray-50 font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Contact Us
            </a>
            <a
              href="/book"
              className="bg-primary-700 text-white hover:bg-primary-800 font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Book a Trial Class
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default FAQ
