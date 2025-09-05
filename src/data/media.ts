export interface MediaItem {
  id: string
  title: string
  description: string
  imageUrl: string
  thumbnailUrl: string
  category: 'classroom' | 'activities' | 'outcomes'
  type: 'photo' | 'video'
  tags: string[]
  featured?: boolean
}

export const pacificCampMedia: MediaItem[] = [
  // Classroom Learning Content
  {
    id: '1',
    title: 'AI Programming Fundamentals',
    description: 'Professional teaching session with students learning AI programming fundamentals',
    imageUrl: '/media/photos/img-01.jpg',
    thumbnailUrl: '/media/photos/thumbs/img-01.jpg',
    category: 'classroom',
    type: 'photo',
    tags: ['programming', 'AI', 'learning'],
    featured: true
  },
  {
    id: '2',
    title: 'Interactive Coding Session',
    description: 'Interactive discussion between teachers and students, deepening understanding of programming concepts',
    imageUrl: '/media/photos/img-02.jpg',
    thumbnailUrl: '/media/photos/thumbs/img-02.jpg',
    category: 'classroom',
    type: 'photo',
    tags: ['coding', 'interaction', 'discussion']
  },
  {
    id: '3',
    title: 'Technology Demonstration',
    description: 'Live technology demonstration showcasing the latest AI technology applications',
    imageUrl: '/media/photos/img-03.jpg',
    thumbnailUrl: '/media/photos/thumbs/img-03.jpg',
    category: 'classroom',
    type: 'video',
    tags: ['demo', 'technology', 'AI']
  },
  
  // Interactive Activities Content
  {
    id: '4',
    title: 'Team Building Games',
    description: 'Teachers and students participating in team building games to enhance collaboration skills',
    imageUrl: '/media/photos/img-04.jpg',
    thumbnailUrl: '/media/photos/thumbs/img-04.jpg',
    category: 'activities',
    type: 'photo',
    tags: ['teamwork', 'games', 'collaboration'],
    featured: true
  },
  {
    id: '5',
    title: 'Creative Craft Workshop',
    description: 'Hands-on creative craft making to develop innovative thinking and practical skills',
    imageUrl: '/media/photos/img-05.jpg',
    thumbnailUrl: '/media/photos/thumbs/img-05.jpg',
    category: 'activities',
    type: 'photo',
    tags: ['craft', 'creativity', 'hands-on']
  },
  {
    id: '6',
    title: 'Interactive Challenge',
    description: 'Team collaboration challenge activities to develop problem-solving skills',
    imageUrl: '/media/photos/img-06.jpg',
    thumbnailUrl: '/media/photos/thumbs/img-06.jpg',
    category: 'activities',
    type: 'video',
    tags: ['challenge', 'problem-solving', 'team']
  },
  
  // Learning Outcomes Content
  {
    id: '7',
    title: 'Student Project Showcase',
    description: 'Students showcasing their creative projects and learning achievements',
    imageUrl: '/media/photos/img-07.jpg',
    thumbnailUrl: '/media/photos/thumbs/img-07.jpg',
    category: 'outcomes',
    type: 'photo',
    tags: ['projects', 'showcase', 'achievement']
  },
  {
    id: '8',
    title: 'Creative Achievements',
    description: 'Student handcraft achievements showcase, demonstrating creativity and skill development',
    imageUrl: '/media/photos/img-08.jpg',
    thumbnailUrl: '/media/photos/thumbs/img-08.jpg',
    category: 'outcomes',
    type: 'photo',
    tags: ['creativity', 'achievement', 'skills'],
    featured: true
  }
]

// Category Configuration
export const mediaCategories = [
  {
    id: 'classroom',
    name: 'Classroom Learning',
    icon: '📚',
    description: 'Professional classroom teaching scenarios'
  },
  {
    id: 'activities', 
    name: 'Interactive Activities',
    icon: '🎮',
    description: 'Interactive activities that combine learning with fun'
  },
  {
    id: 'outcomes',
    name: 'Learning Outcomes', 
    icon: '🏆',
    description: 'Student learning achievements showcase'
  }
]

// Backward compatibility
export const mediaItems = pacificCampMedia
export default pacificCampMedia