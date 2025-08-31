// Blog types for the Airbotix website

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  publishDate: string
  category: 'blog' | 'news' | 'resources'
  tags: string[]
  featuredImage?: string
  readTime: number
  isPublished: boolean
  seoTitle?: string
  seoDescription?: string
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description: string
  color: string
}

export interface BlogTag {
  id: string
  name: string
  slug: string
  count: number
}

export interface BlogSearchParams {
  category?: string
  tags?: string[]
  search?: string
  page?: number
  limit?: number
}

export interface BlogCardProps {
  post: BlogPost
  className?: string
}

export interface BlogFilterProps {
  categories: BlogCategory[]
  tags: BlogTag[]
  selectedCategory?: string
  selectedTags: string[]
  onCategoryChange: (category: string) => void
  onTagChange: (tag: string) => void
  onClearFilters: () => void
}

export interface BlogSearchProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  placeholder?: string
}

export interface RelatedPostsProps {
  currentPostId: string
  posts: BlogPost[]
  maxPosts?: number
}
