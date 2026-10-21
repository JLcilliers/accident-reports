# CarCrashReport

https://www.carcrashreport.com is a demo site that tracks road crashes across the United States from local news. It collects stories every few minutes, groups reports of the same crash into one incident, writes an article for each incident and links back to every source. It also has a guide for each state on how to get a police crash report. The site takes no leads and has no contact forms.

## Stack

- Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4
- Prisma 5 on Supabase Postgres
- Vercel hosting, Vercel Cron and Vercel Blob (incident images)
- OpenRouter for articles, fact extraction, crash checks and images
- Node 22

## Pages

| Path | What it shows |
|---|---|
| `/` | Home page |
| `/incidents` | The 50 newest incidents |
| `/incidents/[slug]` | One incident: article, facts, image and sources |
| `/accidents`, `/accidents/[state]` | Incidents by state |
| `/crash-reports`, `/crash-reports/[state]` | How to get a crash report in each state |
| `/search` | Search incidents |
| `/blog` | Articles, such as US vehicle accident statistics |
| `/about`, `/faq`, `/how-it-works`, `/privacy`, `/terms` | Information pages |
| `/sitemap.xml`, `/robots.txt` | Built from the database |

Old funnel and city URLs redirect in `next.config.ts`.

## Scheduled jobs

Set in `vercel.json`. Each one needs `Authorization: Bearer <CRON_SECRET>`, which Vercel Cron sends.

| Route | Schedule (UTC) | Job |
|---|---|---|
| `/api/cron/ingest-news` | every 20 min | Reads Google News and stores new incidents |
| `/api/cron/ingest-publishers` | :05 and :35 | Reads publisher RSS feeds |
| `/api/cron/generate-seo?limit=10` | every 10 min | Extracts facts and writes articles |
| `/api/cron/generate-images` | :20 and :50 | Draws an image for new articles |

On-request routes with the same header:

- `/api/admin/generate-guide-heroes?slugs=…` draws hero images for the state guides.
- `/api/indexing/submit` sends URLs to the Google Indexing API when it is turned on.

## Environment variables

Names only. Values live in Vercel and in `.env.local`, which is never committed.

| Name | Use |
|---|---|
| `DATABASE_URL`, `DIRECT_URL` | Postgres (pooled and direct) for Prisma |
| `CRON_SECRET` | Protects the cron and admin routes |
| `OPENROUTER_API_KEY` | OpenRouter calls |
| `NEXT_PUBLIC_SITE_URL` | Optional; defaults to `https://www.carcrashreport.com` |
| `ARTICLE_MODEL`, `FACTS_MODEL`, `CRASH_CHECK_MODEL` | Optional model overrides for text |
| `IMAGE_MODEL`, `IMAGE_QUALITY`, `IMAGE_CHECK_MODEL` | Optional model overrides for images |
| `IMAGE_START_DATE` | Only incidents created after this date get images |
| `ARTICLE_DAILY_LIMIT`, `IMAGE_DAILY_LIMIT` | Daily caps |
| `GOOGLE_INDEXING_ENABLED`, `GOOGLE_INDEXING_CREDENTIALS` | Google Indexing API |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob uploads (set by Vercel) |

## Local setup

```bash
npm ci
npm run dev
npm test
npm run lint
```

`npm ci` runs `prisma generate`. `npm run dev` and `npm run build` read the database named by `DATABASE_URL`. `npm test` runs the `node --test` suites in `src/**/__tests__` and needs no database.

## Folders

```
app/            pages, API routes, sitemap and robots
components/     header, footer, hero, incident and blog parts
lib/            Prisma client, state guides, images, SEO and article generation, Google indexing, text helpers
src/lib/        news and publisher feed readers; incidents: parsing, place names, dedupe, saving
prisma/         schema and migrations
scripts/        one-off maintenance scripts (see below)
```

## Scripts

`scripts/check-image-alt.mjs` runs after every build and fails it when a prerendered `<img>` has no alt text.

The other scripts write to or delete from the database named by `DATABASE_URL`: `backfillArticles.ts`, `regenerate-articles.ts`, `clear-articles.ts` and `clear-all-incidents.ts`. Don't run them without the owner's OK.

## Making changes

1. Branch from `main` and open a pull request.
2. Vercel builds a preview for the branch. Previews use the production database, so test with obviously fake data and remove it afterwards.
3. Merge to `main` to deploy production.
