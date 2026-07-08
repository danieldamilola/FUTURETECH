export interface UserProfile {
  id: string
  username: string
  displayName: string
  avatarUrl?: string
  bio?: string
  role: 'admin' | 'moderator' | 'author' | 'user'
  karma: number
  followersCount: number
  followingCount: number
  verified: boolean
  createdAt: string
}

export interface Article {
  id: string
  title: string
  slug: string
  deck: string
  content: string // Markdown or Rich Text
  authorId: string
  author?: UserProfile
  tags: string[]
  readTime: number // in minutes
  publishedAt: string
  updatedAt?: string
  upvotes: number
  commentsCount: number
  coverImage?: string
  audioDuration?: string // If a podcast/audio version exists
  isDraft: boolean
}

export interface Question {
  id: string
  title: string
  slug: string
  body: string
  authorId: string
  author?: UserProfile
  tags: string[]
  upvotes: number
  answersCount: number
  views: number
  isSolved: boolean
  acceptedAnswerId?: string
  createdAt: string
  updatedAt?: string
}

export interface Podcast {
  id: string
  title: string
  slug: string
  description: string
  audioUrl: string
  duration: string
  hostId: string
  host?: UserProfile
  tags: string[]
  createdAt: string
}

export interface Mentor {
  id: string
  userId: string
  user?: UserProfile
  expertise: string[]
  hourlyRate: number
  availability: string // e.g., "Weekends", "Evenings"
  rating: number
  reviewsCount: number
}
