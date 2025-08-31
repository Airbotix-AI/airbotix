import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { blogPosts } from '../../data/blog-posts'
import { blogCategories } from '../../data/blog-categories'
import BlogCard from '../../components/Blog/BlogCard'
import {
  BLOG_PAGE_TITLES,
  BLOG_PAGE_DESCRIPTIONS,
  BLOG_BUTTON_TEXTS,
  BLOG_CATEGORY_NAMES,
  BLOG_SEARCH_PLACEHOLDERS,
} from '../../constants/blog'

const BlogList = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Smart loading state - only show for actual API calls or complex operations
  const handleCategoryChange = (category: string) => {
    // Only show loading if it's a different category and we have many posts
    if (category !== selectedCategory && blogPosts.length > 10) {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
      }, 200)
    }
    setSelectedCategory(category)
  }

  const handleSearchChange = (term: string) => {
    // Only show loading for complex searches or when term length > 3
    if (term.length > 3 && term !== searchTerm) {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
      }, 150)
    }
    setSearchTerm(term)
  }

  // Filter posts based on category and search term
  const filteredPosts = useMemo(() => {
    let filtered = blogPosts.filter(post => post.isPublished)

    if (selectedCategory) {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(term) ||
        post.excerpt.toLowerCase().includes(term) ||
        post.tags.some(tag => tag.toLowerCase().includes(term))
      )
    }

    return filtered.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
  }, [selectedCategory, searchTerm])



  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{BLOG_PAGE_TITLES.MAIN}</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {BLOG_PAGE_DESCRIPTIONS.HERO}
          </p>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryChange('')}
                disabled={isLoading}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === '' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {BLOG_CATEGORY_NAMES.ALL}
              </button>
              {blogCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.slug)}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.slug 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder={BLOG_SEARCH_PLACEHOLDERS.ARTICLES}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                disabled={isLoading}
                className={`w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-12">
                              <div className="inline-flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  <span className="ml-3 text-lg text-gray-600">{BLOG_BUTTON_TEXTS.LOADING_ARTICLES}</span>
                </div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchTerm || selectedCategory ? BLOG_PAGE_DESCRIPTIONS.NO_ARTICLES_FOUND : BLOG_PAGE_DESCRIPTIONS.NO_ARTICLES_AVAILABLE}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || selectedCategory 
                    ? BLOG_PAGE_DESCRIPTIONS.TRY_ADJUSTING
                    : BLOG_PAGE_DESCRIPTIONS.CHECK_BACK_SOON
                  }
                </p>
                {(searchTerm || selectedCategory) && (
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedCategory('')
                    }}
                    className="btn-primary"
                  >
                    {BLOG_BUTTON_TEXTS.CLEAR_FILTERS}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Stay Updated with Airbotix</h2>
          <p className="text-primary-100 max-w-2xl mx-auto mb-8">
            Get the latest insights on AI and robotics education, plus exclusive resources for parents and educators.
          </p>
          <Link to="/contact" className="bg-white text-primary-600 hover:bg-gray-50 font-semibold text-lg px-8 py-3 rounded-lg transition-colors">
            Subscribe to Our Newsletter
          </Link>
        </div>
      </section>
    </div>
  )
}

export default BlogList
