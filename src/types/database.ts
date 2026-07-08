export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string
          avatar_url: string | null
          bio: string | null
          website_url: string | null
          github_url: string | null
          twitter_url: string | null
          linkedin_url: string | null
          tech_stack: string[] | null
          role: 'user' | 'author' | 'moderator' | 'admin'
          reputation: number
          is_mentor: boolean
          is_banned: boolean
          is_ad_free: boolean
          stripe_customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at' | 'role' | 'reputation' | 'is_mentor' | 'is_banned' | 'is_ad_free'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      posts: {
        Row: {
          id: string
          author_id: string
          title: string
          slug: string
          content: string
          excerpt: string | null
          cover_image_url: string | null
          status: 'draft' | 'published' | 'archived'
          read_time_mins: number
          views: number
          upvotes_count: number
          comments_count: number
          bookmarks_count: number
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['posts']['Row'], 'id' | 'created_at' | 'updated_at' | 'views' | 'upvotes_count' | 'comments_count' | 'bookmarks_count'>
        Update: Partial<Database['public']['Tables']['posts']['Insert']>
      }
      questions: {
        Row: {
          id: string
          author_id: string
          title: string
          body: string
          accepted_answer_id: string | null
          views: number
          upvotes_count: number
          answers_count: number
          comments_count: number
          is_resolved: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['questions']['Row'], 'id' | 'created_at' | 'updated_at' | 'views' | 'upvotes_count' | 'answers_count' | 'comments_count' | 'is_resolved' | 'accepted_answer_id'>
        Update: Partial<Database['public']['Tables']['questions']['Insert']>
      }
    }
  }
}
