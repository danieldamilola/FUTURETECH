export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'user' | 'author' | 'moderator' | 'admin';
export type ContentStatus = 'draft' | 'published' | 'archived';
export type TargetType = 'article' | 'question' | 'answer' | 'comment' | 'podcast';
export type FollowTargetType = 'user' | 'tag';
export type NotificationType =
  | 'reply'
  | 'upvote'
  | 'mention'
  | 'accepted_answer'
  | 'follow'
  | 'mentorship_booked'
  | 'mentorship_status_changed';
export type ReportStatus = 'pending' | 'resolved' | 'dismissed';
export type SessionStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'internship';
export type JobStatus = 'active' | 'expired' | 'draft';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string;
          avatar_url: string | null;
          bio: string | null;
          website_url: string | null;
          github_url: string | null;
          twitter_url: string | null;
          linkedin_url: string | null;
          tech_stack: string[];
          role: UserRole;
          reputation: number;
          is_mentor: boolean;
          is_banned: boolean;
          is_ad_free: boolean;
          onboarded: boolean;
          stripe_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name: string;
          avatar_url?: string | null;
          bio?: string | null;
          website_url?: string | null;
          github_url?: string | null;
          twitter_url?: string | null;
          linkedin_url?: string | null;
          tech_stack?: string[];
          role?: UserRole;
          reputation?: number;
          is_mentor?: boolean;
          is_banned?: boolean;
          is_ad_free?: boolean;
          onboarded?: boolean;
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string;
          avatar_url?: string | null;
          bio?: string | null;
          website_url?: string | null;
          github_url?: string | null;
          twitter_url?: string | null;
          linkedin_url?: string | null;
          tech_stack?: string[];
          role?: UserRole;
          reputation?: number;
          is_mentor?: boolean;
          is_banned?: boolean;
          is_ad_free?: boolean;
          onboarded?: boolean;
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      articles: {
        Row: {
          id: string;
          author_id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content_json: Json;
          content_html: string;
          cover_image_url: string | null;
          meta_description: string | null;
          status: ContentStatus;
          read_time_mins: number;
          views: number;
          upvotes_count: number;
          downvotes_count: number;
          comments_count: number;
          bookmarks_count: number;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content_json: Json;
          content_html: string;
          cover_image_url?: string | null;
          meta_description?: string | null;
          status?: ContentStatus;
          read_time_mins?: number;
          views?: number;
          upvotes_count?: number;
          downvotes_count?: number;
          comments_count?: number;
          bookmarks_count?: number;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          author_id?: string;
          title?: string;
          slug?: string;
          excerpt?: string | null;
          content_json?: Json;
          content_html?: string;
          cover_image_url?: string | null;
          meta_description?: string | null;
          status?: ContentStatus;
          read_time_mins?: number;
          views?: number;
          upvotes_count?: number;
          downvotes_count?: number;
          comments_count?: number;
          bookmarks_count?: number;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Functions: {
      search_content: {
        Args: { q: string };
        Returns: {
          content_type: string;
          id: string;
          title: string;
          snippet: string;
          url: string;
          rank: number;
        }[];
      };
    };
  };
}
