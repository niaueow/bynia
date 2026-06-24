# ByNia — URL Shortener

A lightweight, neobrutalist URL shortening platform built with Vue 3, Tailwind CSS, and Supabase.

## Features

- **URL Shortening** — Convert long URLs to clean, shareable links
- **Custom Aliases** — Choose your own short link names
- **QR Code Generation** — Generate QR codes for any shortened link
- **Click Tracking** — Monitor how many times each link is accessed
- **Admin Dashboard** — View, search, and manage all links
- **Rate Limiting** — 3 links per browser per day (localStorage-based)

## Tech Stack

- **Frontend**: Vue 3 + Vite
- **Styling**: Tailwind CSS v4
- **Backend**: Supabase (PostgreSQL + Auth)
- **Deployment**: Vercel

## Setup

### 1. Clone & Install

```bash
git clone https://github.com/your-username/bynia.git
cd bynia
npm install
```

### 2. Supabase Configuration

1. Create a new project at [supabase.com](https://supabase.com)

2. Run the following SQL in the Supabase SQL Editor:

```sql
-- Create links table
CREATE TABLE links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  alias TEXT UNIQUE NOT NULL,
  original_url TEXT NOT NULL,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for fast alias lookups
CREATE INDEX idx_links_alias ON links(alias);

-- RPC for atomic click increment
CREATE OR REPLACE FUNCTION increment_clicks(link_alias TEXT)
RETURNS VOID AS $$
  UPDATE links SET clicks = clicks + 1 WHERE alias = link_alias;
$$ LANGUAGE sql;
```

3. Configure Row Level Security (RLS):

```sql
-- Enable RLS
ALTER TABLE links ENABLE ROW LEVEL SECURITY;

-- Allow public to read links (for redirects)
CREATE POLICY "Public can read links"
  ON links FOR SELECT
  USING (true);

-- Allow public to insert links
CREATE POLICY "Public can insert links"
  ON links FOR INSERT
  WITH CHECK (true);

-- Only authenticated users can delete
CREATE POLICY "Authenticated can delete links"
  ON links FOR DELETE
  USING (auth.role() = 'authenticated');
```

4. Set up Google OAuth:
   - Go to Supabase Dashboard → Authentication → Providers → Google
   - Enable Google provider
   - Add your Google Client ID and Secret (from Google Cloud Console)
   - Set the redirect URL to: `https://your-project.supabase.co/auth/v1/callback`

### 3. Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ADMIN_EMAIL=your-email@gmail.com
VITE_APP_URL=https://bynia.vercel.app
```

### 4. Run Locally

```bash
npm run dev
```

## Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

The `vercel.json` file handles SPA rewrites automatically.

## Project Structure

```
bynia/
├── src/
│   ├── components/     # Shared UI components
│   ├── pages/          # Page components
│   ├── lib/            # Supabase client & API functions
│   ├── router/         # Vue Router configuration
│   ├── App.vue         # Root component
│   ├── main.js         # Entry point
│   └── index.css       # Tailwind + design system
├── public/             # Static assets
├── index.html          # HTML entry
├── vite.config.js      # Vite configuration
└── vercel.json         # Vercel deployment config
```

## License

MIT
