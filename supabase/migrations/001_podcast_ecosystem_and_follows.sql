-- ============================================================
-- FutureTech Schema Patch: Podcast Ecosystem + Follows
-- Apply this migration after the initial schema.sql
-- ============================================================

-- 1. FOLLOWS TABLE
-- Supports following both users and tags.
-- follow_target_type ENUM already exists from schema.sql
CREATE TABLE IF NOT EXISTS follows (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_type      follow_target_type NOT NULL,
  -- One of these will be set depending on target_type:
  followed_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  followed_tag_id  UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at       TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Only one target can be set at a time
  CONSTRAINT single_follow_target CHECK (
    (followed_user_id IS NOT NULL)::INT +
    (followed_tag_id IS NOT NULL)::INT = 1
  ),
  -- A user cannot follow the same target twice
  CONSTRAINT unique_user_follow UNIQUE (follower_id, followed_user_id),
  CONSTRAINT unique_tag_follow  UNIQUE (follower_id, followed_tag_id)
);

-- 2. PODCAST SHOWS TABLE
-- A "show" is a creator's podcast channel/series (e.g. "The Rust Show" by @daejung)
CREATE TABLE IF NOT EXISTS podcast_shows (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  slug             TEXT UNIQUE NOT NULL,
  description      TEXT NOT NULL,
  cover_image_url  TEXT,
  category         TEXT DEFAULT 'Engineering' NOT NULL,
  is_published     BOOLEAN DEFAULT TRUE NOT NULL,
  followers_count  INT DEFAULT 0 NOT NULL,
  episodes_count   INT DEFAULT 0 NOT NULL,
  created_at       TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at       TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. PATCH: podcasts table — add user ownership, show linking, and engagement columns
ALTER TABLE podcasts
  ADD COLUMN IF NOT EXISTS author_id        UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS show_id          UUID REFERENCES podcast_shows(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS cover_image_url  TEXT,
  ADD COLUMN IF NOT EXISTS episode_number   INT,
  ADD COLUMN IF NOT EXISTS plays_count      INT DEFAULT 0 NOT NULL,
  ADD COLUMN IF NOT EXISTS upvotes_count    INT DEFAULT 0 NOT NULL,
  ADD COLUMN IF NOT EXISTS comments_count   INT DEFAULT 0 NOT NULL;

-- 4. PODCAST SHOW FOLLOWS (separate from user follows for cleaner queries)
-- Note: you can also use the main follows table with target_type='user' pointed at the show author,
-- but a dedicated show_follows table makes "episodes from shows you follow" queries simpler.
CREATE TABLE IF NOT EXISTS show_follows (
  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  show_id  UUID NOT NULL REFERENCES podcast_shows(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT unique_show_follow UNIQUE (user_id, show_id)
);

-- 5. RLS POLICIES for new tables
ALTER TABLE follows       ENABLE ROW LEVEL SECURITY;
ALTER TABLE podcast_shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE show_follows  ENABLE ROW LEVEL SECURITY;

-- Follows: public read, owner write
CREATE POLICY "Follows are viewable by everyone"     ON follows       FOR SELECT USING (true);
CREATE POLICY "Users can manage own follows"         ON follows       FOR ALL    USING (auth.uid() = follower_id);

-- Podcast shows: public read, owner write
CREATE POLICY "Published shows viewable by everyone" ON podcast_shows FOR SELECT USING (is_published = true OR auth.uid() = author_id);
CREATE POLICY "Authors can insert shows"             ON podcast_shows FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own shows"         ON podcast_shows FOR UPDATE USING (auth.uid() = author_id);

-- Show follows: public read, owner write
CREATE POLICY "Show follows viewable by everyone"    ON show_follows  FOR SELECT USING (true);
CREATE POLICY "Users can manage own show follows"    ON show_follows  FOR ALL    USING (auth.uid() = user_id);

-- 6. Update podcasts RLS to allow author inserts
CREATE POLICY "Authors can insert podcasts"  ON podcasts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own podcasts" ON podcasts FOR UPDATE USING (auth.uid() = author_id);

-- 7. HELPER INDEXES for follow/feed queries
CREATE INDEX IF NOT EXISTS idx_follows_follower     ON follows       (follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_user_target  ON follows       (followed_user_id) WHERE followed_user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_show_follows_user    ON show_follows  (user_id);
CREATE INDEX IF NOT EXISTS idx_show_follows_show    ON show_follows  (show_id);
CREATE INDEX IF NOT EXISTS idx_podcasts_show        ON podcasts      (show_id);
CREATE INDEX IF NOT EXISTS idx_podcasts_author      ON podcasts      (author_id);
CREATE INDEX IF NOT EXISTS idx_podcast_shows_author ON podcast_shows (author_id);
