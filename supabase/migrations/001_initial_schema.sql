-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id           uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username     text UNIQUE NOT NULL,
  display_name text NOT NULL,
  avatar_url   text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- SNIPPETS
-- ============================================================
CREATE TABLE IF NOT EXISTS snippets (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title       text NOT NULL,
  language    text NOT NULL,
  description text,
  code        text NOT NULL,
  is_public   boolean NOT NULL DEFAULT false,
  view_count  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- TAGS
-- ============================================================
CREATE TABLE IF NOT EXISTS tags (
  id   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL
);

-- ============================================================
-- SNIPPET_TAGS
-- ============================================================
CREATE TABLE IF NOT EXISTS snippet_tags (
  snippet_id uuid NOT NULL REFERENCES snippets(id) ON DELETE CASCADE,
  tag_id     uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (snippet_id, tag_id)
);

-- ============================================================
-- SNIPPET_SHARES
-- ============================================================
CREATE TABLE IF NOT EXISTS snippet_shares (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snippet_id   uuid NOT NULL REFERENCES snippets(id) ON DELETE CASCADE,
  shared_with  uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (snippet_id, shared_with)
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_snippets_user_id   ON snippets(user_id);
CREATE INDEX IF NOT EXISTS idx_snippets_is_public ON snippets(is_public);
CREATE INDEX IF NOT EXISTS idx_snippet_tags_snippet ON snippet_tags(snippet_id);
CREATE INDEX IF NOT EXISTS idx_snippet_shares_snippet ON snippet_shares(snippet_id);
CREATE INDEX IF NOT EXISTS idx_snippet_shares_shared_with ON snippet_shares(shared_with);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- ============================================================
-- ENABLE RLS
-- ============================================================
ALTER TABLE profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE snippets       ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags           ENABLE ROW LEVEL SECURITY;
ALTER TABLE snippet_tags   ENABLE ROW LEVEL SECURITY;
ALTER TABLE snippet_shares ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PROFILES POLICIES
-- ============================================================
CREATE POLICY "profiles_select_all"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

-- ============================================================
-- SNIPPETS POLICIES
-- ============================================================
CREATE POLICY "snippets_select"
  ON snippets FOR SELECT
  USING (
    is_public = true
    OR user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM snippet_shares
      WHERE snippet_shares.snippet_id = snippets.id
        AND snippet_shares.shared_with = auth.uid()
    )
  );

CREATE POLICY "snippets_insert_own"
  ON snippets FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "snippets_update_own"
  ON snippets FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "snippets_delete_own"
  ON snippets FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================
-- TAGS POLICIES
-- ============================================================
CREATE POLICY "tags_select_all"
  ON tags FOR SELECT
  USING (true);

CREATE POLICY "tags_insert_authenticated"
  ON tags FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- SNIPPET_TAGS POLICIES
-- ============================================================
CREATE POLICY "snippet_tags_select_all"
  ON snippet_tags FOR SELECT
  USING (true);

CREATE POLICY "snippet_tags_insert_own"
  ON snippet_tags FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM snippets
      WHERE snippets.id = snippet_tags.snippet_id
        AND snippets.user_id = auth.uid()
    )
  );

CREATE POLICY "snippet_tags_delete_own"
  ON snippet_tags FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM snippets
      WHERE snippets.id = snippet_tags.snippet_id
        AND snippets.user_id = auth.uid()
    )
  );

-- ============================================================
-- SNIPPET_SHARES POLICIES
-- ============================================================
CREATE POLICY "snippet_shares_select_owner"
  ON snippet_shares FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM snippets
      WHERE snippets.id = snippet_shares.snippet_id
        AND snippets.user_id = auth.uid()
    )
  );

CREATE POLICY "snippet_shares_insert_owner"
  ON snippet_shares FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM snippets
      WHERE snippets.id = snippet_shares.snippet_id
        AND snippets.user_id = auth.uid()
    )
  );

CREATE POLICY "snippet_shares_delete_owner"
  ON snippet_shares FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM snippets
      WHERE snippets.id = snippet_shares.snippet_id
        AND snippets.user_id = auth.uid()
    )
  );

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER snippets_updated_at
  BEFORE UPDATE ON snippets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    LOWER(REGEXP_REPLACE(SPLIT_PART(NEW.email, '@', 1), '[^a-z0-9_]', '_', 'g')),
    COALESCE(NEW.raw_user_meta_data->>'display_name', SPLIT_PART(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE OR REPLACE FUNCTION increment_view_count(snippet_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE snippets
  SET view_count = view_count + 1
  WHERE id = snippet_id
    AND (is_public = true OR EXISTS (
      SELECT 1 FROM snippet_shares
      WHERE snippet_shares.snippet_id = snippets.id
    ));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
