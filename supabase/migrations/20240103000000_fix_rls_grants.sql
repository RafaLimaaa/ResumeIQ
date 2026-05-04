-- Grant table-level permissions to the roles used by PostgREST.
-- Without these, PostgreSQL raises "permission denied" (42501) before RLS
-- is even evaluated — RLS controls which rows, GRANT controls table access.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.analyses     TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles     TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resume_files TO anon, authenticated;

-- ============================================================
-- Recreate analyses policies
-- ============================================================
DROP POLICY IF EXISTS "analyses_select_own"       ON public.analyses;
DROP POLICY IF EXISTS "analyses_select_anonymous" ON public.analyses;
DROP POLICY IF EXISTS "analyses_insert_own"       ON public.analyses;
DROP POLICY IF EXISTS "analyses_update_own"       ON public.analyses;
DROP POLICY IF EXISTS "analyses_delete_own"       ON public.analyses;

-- Authenticated users read their own analyses
CREATE POLICY "analyses_select_own" ON public.analyses
  FOR SELECT USING (auth.uid() = user_id);

-- Anonymous analyses are readable without auth (user_id IS NULL)
CREATE POLICY "analyses_select_anonymous" ON public.analyses
  FOR SELECT USING (user_id IS NULL);

-- Insert: authenticated users link to their id; anonymous leave user_id null
CREATE POLICY "analyses_insert_own" ON public.analyses
  FOR INSERT WITH CHECK (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    OR
    (auth.uid() IS NULL AND user_id IS NULL)
  );

CREATE POLICY "analyses_update_own" ON public.analyses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "analyses_delete_own" ON public.analyses
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- Recreate profiles policies
-- ============================================================
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;

CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_delete_own" ON public.profiles
  FOR DELETE USING (auth.uid() = id);
