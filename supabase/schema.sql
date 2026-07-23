-- FutureTech Master Database Schema Migration
-- PostgreSQL / Supabase Schema Definition

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('user', 'author', 'moderator', 'admin');
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE target_type AS ENUM ('article', 'question', 'answer', 'comment', 'podcast');
CREATE TYPE follow_target_type AS ENUM ('user', 'tag');
CREATE TYPE notification_type AS ENUM ('reply', 'upvote', 'mention', 'accepted_answer', 'follow', 'mentorship_booked', 'mentorship_status_changed');
CREATE TYPE report_status AS ENUM ('pending', 'resolved', 'dismissed');
CREATE TYPE session_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
CREATE TYPE employment_type AS ENUM ('full_time', 'part_time', 'contract', 'internship');
CREATE TYPE job_status AS ENUM ('active', 'expired', 'draft');

-- 2. TABLES

-- Profiles (1:1 with auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  website_url TEXT,
  github_url TEXT,
  twitter_url TEXT,
  linkedin_url TEXT,
  tech_stack TEXT[] DEFAULT '{}'::TEXT[],
  role user_role DEFAULT 'user' NOT NULL,
  reputation INT DEFAULT 0 NOT NULL,
  is_mentor BOOLEAN DEFAULT FALSE NOT NULL,
  is_banned BOOLEAN DEFAULT FALSE NOT NULL,
  is_ad_free BOOLEAN DEFAULT FALSE NOT NULL,
  onboarded BOOLEAN DEFAULT FALSE NOT NULL,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Tags
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Articles
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  content_html TEXT NOT NULL,
  cover_image_url TEXT,
  meta_description TEXT,
  status content_status DEFAULT 'draft' NOT NULL,
  read_time_mins INT DEFAULT 1 NOT NULL,
  views INT DEFAULT 0 NOT NULL,
  upvotes_count INT DEFAULT 0 NOT NULL,
  downvotes_count INT DEFAULT 0 NOT NULL,
  comments_count INT DEFAULT 0 NOT NULL,
  bookmarks_count INT DEFAULT 0 NOT NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Questions
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  body_html TEXT NOT NULL,
  accepted_answer_id UUID,
  views INT DEFAULT 0 NOT NULL,
  upvotes_count INT DEFAULT 0 NOT NULL,
  downvotes_count INT DEFAULT 0 NOT NULL,
  answers_count INT DEFAULT 0 NOT NULL,
  comments_count INT DEFAULT 0 NOT NULL,
  is_resolved BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Answers
CREATE TABLE answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  body_html TEXT NOT NULL,
  upvotes_count INT DEFAULT 0 NOT NULL,
  downvotes_count INT DEFAULT 0 NOT NULL,
  is_accepted BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Foreign Key binding for accepted_answer_id
ALTER TABLE questions 
  ADD CONSTRAINT fk_questions_accepted_answer 
  FOREIGN KEY (accepted_answer_id) REFERENCES answers(id) ON DELETE SET NULL;

-- Comments
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  answer_id UUID REFERENCES answers(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  upvotes_count INT DEFAULT 0 NOT NULL,
  downvotes_count INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Podcasts
CREATE TABLE podcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  duration_seconds INT NOT NULL,
  show_notes_html TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Jobs
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  company_logo_url TEXT,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  employment_type employment_type DEFAULT 'full_time' NOT NULL,
  salary_range TEXT,
  apply_url TEXT NOT NULL,
  description_html TEXT NOT NULL,
  status job_status DEFAULT 'active' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Mentor Profiles
CREATE TABLE mentor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  headline TEXT NOT NULL,
  hourly_rate_cents INT DEFAULT 0 NOT NULL,
  expertise_tags TEXT[] DEFAULT '{}'::TEXT[],
  bio TEXT NOT NULL,
  is_accepting_sessions BOOLEAN DEFAULT TRUE NOT NULL,
  stripe_account_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Mentorship Sessions
CREATE TABLE mentorship_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mentor_id UUID NOT NULL REFERENCES mentor_profiles(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_mins INT DEFAULT 45 NOT NULL,
  topic TEXT NOT NULL,
  status session_status DEFAULT 'pending' NOT NULL,
  stripe_transfer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Votes (Typed Foreign Keys with ON DELETE CASCADE)
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  answer_id UUID REFERENCES answers(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  podcast_id UUID REFERENCES podcasts(id) ON DELETE CASCADE,
  value SMALLINT NOT NULL CHECK (value IN (-1, 1)),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT single_target CHECK (
    (article_id IS NOT NULL)::INT +
    (question_id IS NOT NULL)::INT +
    (answer_id IS NOT NULL)::INT +
    (comment_id IS NOT NULL)::INT +
    (podcast_id IS NOT NULL)::INT = 1
  )
);

-- Bookmarks
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  podcast_id UUID REFERENCES podcasts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT single_bookmark_target CHECK (
    (article_id IS NOT NULL)::INT +
    (question_id IS NOT NULL)::INT +
    (podcast_id IS NOT NULL)::INT = 1
  )
);

-- 3. FUNCTIONS & TRIGGERS

-- Auto-create profile on auth.users signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url, onboarded)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'Member'),
    NEW.raw_user_meta_data->>'avatar_url',
    FALSE
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Role check helper functions
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_moderator()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('moderator', 'admin')
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 4. RLS POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE podcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentorship_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Published articles are viewable by everyone" ON articles FOR SELECT USING (status = 'published' OR auth.uid() = author_id);
CREATE POLICY "Questions are viewable by everyone" ON questions FOR SELECT USING (true);
CREATE POLICY "Answers are viewable by everyone" ON answers FOR SELECT USING (true);
CREATE POLICY "Comments are viewable by everyone" ON comments FOR SELECT USING (true);
CREATE POLICY "Podcasts are viewable by everyone" ON podcasts FOR SELECT USING (true);
CREATE POLICY "Active jobs are viewable by everyone" ON jobs FOR SELECT USING (status = 'active');
CREATE POLICY "Mentor profiles are viewable by everyone" ON mentor_profiles FOR SELECT USING (true);
CREATE POLICY "User votes viewable by owner" ON votes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "User bookmarks viewable by owner" ON bookmarks FOR SELECT USING (auth.uid() = user_id);

-- Owner Write Policies
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Authors can insert articles" ON articles FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own articles" ON articles FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can insert questions" ON questions FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own questions" ON questions FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can insert answers" ON answers FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own answers" ON answers FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can insert comments" ON comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can manage own votes" ON votes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own bookmarks" ON bookmarks FOR ALL USING (auth.uid() = user_id);
