import { Link } from 'react-router-dom'
import { BlogPost } from '../../types/blog'
import { formatDate } from '../../utils'
import { BLOG_META_TEXTS, BLOG_BUTTON_TEXTS } from '../../constants/blog'

interface BlogCardProps {
  post: BlogPost
  className?: string
}

const BlogCard = ({ post, className = '' }: BlogCardProps) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'blog': return 'bg-primary-100 text-primary-800'
      case 'news': return 'bg-secondary-100 text-secondary-800'
      case 'resources': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <article className={`border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden ${className}`}>
      {/* Featured Image */}
      {post.featuredImage && (
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Category and Date */}
        <div className="flex items-center justify-between mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
            {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
          </span>
          <span className="text-sm text-gray-500">{formatDate(post.publishDate)}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
          <Link
            to={`/blog/${post.slug}`}
            className="hover:text-primary-700 focus:underline outline-none"
          >
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
            >
              {tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
              +{post.tags.length - 3} more
            </span>
          )}
        </div>

        {/* Author and Read Time */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{BLOG_META_TEXTS.BY} {post.author}</span>
          <span>{post.readTime} {BLOG_META_TEXTS.MIN_READ}</span>
        </div>

        {/* Read More Button */}
        <div className="mt-4">
          <Link
            to={`/blog/${post.slug}`}
            className="btn-outline w-full text-center"
          >
            {BLOG_BUTTON_TEXTS.READ_MORE}
          </Link>
        </div>
      </div>
    </article>
  )
}

export default BlogCard
