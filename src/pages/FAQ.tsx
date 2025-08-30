import { useState } from 'react'
import { Link } from 'react-router-dom'
import { faqCategories, getAllFAQData, searchFAQ } from '../data/faq'

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const categories = [
    { id: 'all', name: '全部问题', icon: '🔍' },
    ...faqCategories.map(cat => ({ id: cat.id, name: cat.name, icon: cat.icon }))
  ]

  // 切换展开/收起
  const toggleItem = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  // 搜索和筛选
  const getFilteredData = () => {
    let allData = getAllFAQData()

    // 按分类筛选
    if (activeCategory !== 'all') {
      allData = allData.filter(item => item.category === activeCategory)
    }

    // 按搜索词筛选
    if (searchTerm) {
      allData = searchFAQ(searchTerm).filter(item => 
        activeCategory === 'all' || item.category === activeCategory
      )
    }

    return allData
  }

  const filteredData = getFilteredData()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              常见问题解答
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              找到您关于AI和机器人教育的所有答案。如果这里没有您要找的答案，请随时联系我们。
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索问题..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredData.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到相关问题</h3>
              <p className="text-gray-600 mb-6">尝试使用不同的关键词搜索，或者联系我们获取帮助。</p>
              <Link to="/contact" className="btn-primary">
                联系我们
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredData.map((item, index) => (
                <div key={`${item.category}-${index}`} className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <button
                    onClick={() => toggleItem(`${item.category}-${index}`)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900">{item.question}</span>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedItems.has(`${item.category}-${index}`) ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedItems.has(`${item.category}-${index}`) && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            还有其他问题？
          </h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            我们的专业团队随时为您提供帮助。无论是课程咨询、技术问题还是合作洽谈，我们都乐意为您解答。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="bg-white text-primary-600 hover:bg-gray-50 font-semibold px-8 py-3 rounded-lg transition-colors">
              联系我们
            </Link>
            <Link to="/book" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold px-8 py-3 rounded-lg transition-colors">
              立即预约
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default FAQ
