DO $$
DECLARE
  user1_id uuid := 'aaaaaaaa-0000-0000-0000-000000000001';
  user2_id uuid := 'bbbbbbbb-0000-0000-0000-000000000002';

  s1 uuid := gen_random_uuid();
  s2 uuid := gen_random_uuid();
  s3 uuid := gen_random_uuid();
  s4 uuid := gen_random_uuid();
  s5 uuid := gen_random_uuid();
  s6 uuid := gen_random_uuid();
  s7 uuid := gen_random_uuid();
  s8 uuid := gen_random_uuid();

  t_ts  uuid; t_py  uuid; t_bash uuid;
  t_sql uuid; t_js  uuid; t_go   uuid;
  t_css uuid; t_api uuid;
BEGIN
  INSERT INTO profiles (id, username, display_name) VALUES
    (user1_id, 'alice_dev',  'Alice Johnson'),
    (user2_id, 'bob_codes',  'Bob Smith')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO tags (id, name) VALUES
    (gen_random_uuid(), 'typescript'),
    (gen_random_uuid(), 'python'),
    (gen_random_uuid(), 'bash'),
    (gen_random_uuid(), 'sql'),
    (gen_random_uuid(), 'javascript'),
    (gen_random_uuid(), 'go'),
    (gen_random_uuid(), 'css'),
    (gen_random_uuid(), 'api')
  ON CONFLICT (name) DO NOTHING;

  SELECT id INTO t_ts   FROM tags WHERE name = 'typescript';
  SELECT id INTO t_py   FROM tags WHERE name = 'python';
  SELECT id INTO t_bash FROM tags WHERE name = 'bash';
  SELECT id INTO t_sql  FROM tags WHERE name = 'sql';
  SELECT id INTO t_js   FROM tags WHERE name = 'javascript';
  SELECT id INTO t_go   FROM tags WHERE name = 'go';
  SELECT id INTO t_css  FROM tags WHERE name = 'css';
  SELECT id INTO t_api  FROM tags WHERE name = 'api';

  INSERT INTO snippets (id, user_id, title, language, description, code, is_public) VALUES
    (s1, user1_id, 'Debounce Hook', 'typescript', 'A reusable debounce hook for React',
    E'import { useState, useEffect } from "react"\n\nexport function useDebounce<T>(value: T, delay: number): T {\n  const [debounced, setDebounced] = useState<T>(value)\n\n  useEffect(() => {\n    const timer = setTimeout(() => setDebounced(value), delay)\n    return () => clearTimeout(timer)\n  }, [value, delay])\n\n  return debounced\n}',
    true),

    (s2, user1_id, 'Flatten Nested List', 'python', 'Recursively flatten a nested list',
    E'def flatten(lst):\n    result = []\n    for item in lst:\n        if isinstance(item, list):\n            result.extend(flatten(item))\n        else:\n            result.append(item)\n    return result\n\n# Example\nprint(flatten([1, [2, [3, 4]], 5]))  # [1, 2, 3, 4, 5]',
    true),

    (s3, user1_id, 'Git Undo Last Commit', 'bash', 'Undo last commit but keep changes staged',
    E'# Undo last commit, keep changes staged\ngit reset --soft HEAD~1\n\n# Undo last commit, unstage changes\ngit reset HEAD~1\n\n# Nuclear option: discard all changes\ngit reset --hard HEAD~1',
    true),

    (s4, user1_id, 'Find Duplicate Emails', 'sql', 'Query to find duplicate email entries',
    E'SELECT email, COUNT(*) as count\nFROM users\nGROUP BY email\nHAVING COUNT(*) > 1\nORDER BY count DESC;',
    false),

    (s5, user2_id, 'Fetch with Retry', 'javascript', 'Fetch wrapper with exponential backoff retry',
    E'async function fetchWithRetry(url, retries = 3, delay = 500) {\n  for (let i = 0; i < retries; i++) {\n    try {\n      const res = await fetch(url)\n      if (!res.ok) throw new Error(res.statusText)\n      return await res.json()\n    } catch (err) {\n      if (i === retries - 1) throw err\n      await new Promise(r => setTimeout(r, delay * 2 ** i))\n    }\n  }\n}',
    true),

    (s6, user2_id, 'Go HTTP Server', 'go', 'Minimal Go HTTP server with routing',
    E'package main\n\nimport (\n  "fmt"\n  "net/http"\n)\n\nfunc main() {\n  http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {\n    fmt.Fprintf(w, "Hello, World!")\n  })\n  http.ListenAndServe(":8080", nil)\n}',
    true),

    (s7, user2_id, 'CSS Glass Morphism Card', 'css', 'Frosted glass card effect with CSS',
    E'.glass-card {\n  background: rgba(255, 255, 255, 0.1);\n  backdrop-filter: blur(10px);\n  -webkit-backdrop-filter: blur(10px);\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  border-radius: 16px;\n  padding: 24px;\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);\n}',
    false),

    (s8, user1_id, 'JWT Decode (No Library)', 'typescript', 'Decode a JWT payload without any library',
    E'function decodeJWT(token: string): Record<string, unknown> {\n  const payload = token.split(".")[1]\n  const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"))\n  return JSON.parse(decoded)\n}\n\n// Usage\nconst data = decodeJWT("eyJhbG...")\nconsole.log(data)',
    true);

  INSERT INTO snippet_tags (snippet_id, tag_id) VALUES
    (s1, t_ts), (s1, t_api),
    (s2, t_py),
    (s3, t_bash),
    (s4, t_sql),
    (s5, t_js), (s5, t_api),
    (s6, t_go), (s6, t_api),
    (s7, t_css),
    (s8, t_ts);

  INSERT INTO snippet_shares (snippet_id, shared_with) VALUES
    (s4, user2_id),
    (s7, user1_id);
END $$;
