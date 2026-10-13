# SEO rollout and verification

The working branch now supplies /robots.txt and /sitemap.xml, production-domain metadata, canonical URLs for home/shop/products, social metadata, and noindex headers for private and preview routes. This does not establish why Google has not indexed the live deployment.

## Before release

- Run npm run build and npm run lint with dependencies installed. Local verification here covered syntax and isolated sitemap/robots/header behavior; it did not run the Next.js build or fetch deployed responses.
- Verify the preview has X-Robots-Tag: noindex, nofollow.
- After an authorized production release, inspect /robots.txt (Allow: / and Sitemap: https://kharidly.pk/sitemap.xml), /sitemap.xml (only public pages and active products), / and /products/<active-slug> (correct canonical URL, title, description; no production noindex).
- Check /checkout, /account and /order-confirmation/<number> return X-Robots-Tag: noindex, nofollow. These directives do not replace authentication.
- Check inactive/missing products return 404, not an indexable product page.
- Check shop pagination has its own canonical URL; filtered/search listings have noindex, follow.
- Test the canonical host and www redirect using the existing domain configuration. No domain/DNS changes are included here.

## Search Console

Use a verified kharidly.pk property, inspect https://kharidly.pk/, run the live test, review indexing exclusions and submit https://kharidly.pk/sitemap.xml. Request indexing for the home page when it is eligible. No Search Console access is connected to this session, so these actions have not been performed. Indexing and ranking are not guaranteed.

The product sitemap deliberately raises an error above the 50,000 URL limit rather than silently dropping products. Split it with generateSitemaps before reaching that size. Product modification dates come from the database; static pages do not advertise invented modification dates.

Preview/development exclusion uses VERCEL_ENV. Deployments hosted outside Vercel need an equivalent noindex policy for staging.
