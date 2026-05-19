# Supabase setup for BILLTY

This project uses Supabase to persist bilty records. Follow these steps to set up and run locally.

1. Create a Supabase project
   - Go to https://app.supabase.com and create a new project.
   - Note the `Project URL` and `anon` public key.

2. Create the `bilties` table

Run the SQL (in Supabase SQL editor):

```sql
CREATE TABLE public.bilties (
  gc_number text PRIMARY KEY,
  data jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

3. Add environment variables

Create a local environment file (e.g. `.env.local`) in project root with:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=public-anon-key
```

4. Install dependencies and run

```bash
npm install
npm run dev
```

Notes
- `G.C. Number` is used as the unique primary identifier. The UI prevents duplicates on create and allows updating existing entries via the `Update` button after loading.
- Exporting to PDF uses `html2pdf.js` (dynamically imported). If you want server-side PDF generation, replace the client flow with a server endpoint.

If you want help wiring a Supabase service role key or deploying, tell me your preferred hosting provider and I can add instructions.
