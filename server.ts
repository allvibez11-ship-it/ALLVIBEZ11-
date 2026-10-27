import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { db } from './server/db.js';
import { apiRouter } from './server/api.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = parseInt(process.env.PORT || '3000', 10);

async function startServer() {
  const app = express();

  // Enable JSON and URL-encoded parsing with generous limits for media uploads
  app.use(express.json({ limit: '30mb' }));
  app.use(express.urlencoded({ extended: true, limit: '30mb' }));

  // Ensure public uploads directory
  const uploadsDir = path.resolve(__dirname, 'public/uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use('/uploads', express.static(uploadsDir));

  // 1. Dynamic Search Engine & Monetag Verification File Handler
  // Serves Google Search Console verification HTML file or Monetag verification file at the website root
  app.get('/:filename([a-zA-Z0-9_-]+\\.[a-zA-Z0-9]+)', (req, res, next) => {
    const { filename } = req.params;
    const data = db.get();

    // Check Google Search Console Verification File
    if (
      data.googleSettings.verificationMethod === 'html_file' &&
      data.googleSettings.verificationFileName &&
      filename.toLowerCase() === data.googleSettings.verificationFileName.toLowerCase().trim()
    ) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.send(data.googleSettings.verificationFileContent || `google-site-verification: ${filename}`);
    }

    // Check Monetag Verification File
    if (
      data.monetagSettings.verificationMethod === 'html_file' &&
      data.monetagSettings.verificationFileName &&
      filename.toLowerCase() === data.monetagSettings.verificationFileName.toLowerCase().trim()
    ) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.send(data.monetagSettings.verificationFileContent || `<!-- monetag verification: ${filename} -->`);
    }

    next();
  });

  // 2. Dynamic XML Sitemap (/sitemap.xml)
  app.get('/sitemap.xml', (req, res) => {
    const data = db.get();
    const host = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const now = new Date().toISOString();

    const staticRoutes = [
      '',
      '/music',
      '/musicians',
      '/movies',
      '/actors',
      '/nollywood',
      '/hollywood',
      '/celebrity-news',
      '/trending',
      '/about',
      '/contact',
      '/privacy',
      '/terms',
      '/disclaimer',
    ];

    let urls = staticRoutes.map((route) => `
    <url>
      <loc>${host}${route}</loc>
      <lastmod>${now}</lastmod>
      <changefreq>daily</changefreq>
      <priority>${route === '' ? '1.0' : '0.8'}</priority>
    </url>`);

    const publishedArticles = data.articles.filter((a) => a.status === 'published');
    publishedArticles.forEach((art) => {
      urls.push(`
    <url>
      <loc>${host}/article/${art.slug}</loc>
      <lastmod>${art.updatedAt || art.publishedAt || now}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.9</priority>
    </url>`);
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.send(xml);
  });

  // 3. Dynamic robots.txt
  app.get('/robots.txt', (req, res) => {
    const host = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const robots = `# ALLVIBEZ11 - Robots Configuration
User-agent: *
Allow: /
Allow: /article/*
Allow: /music
Allow: /movies
Allow: /nollywood
Allow: /hollywood
Allow: /celebrity-news
Allow: /trending
Allow: /sitemap.xml
Allow: /favicon.svg
Allow: /logo.svg

# Disallow admin dashboard and private internal APIs from search engine indexing
Disallow: /admin
Disallow: /api/admin/

Sitemap: ${host}/sitemap.xml
`;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(robots);
  });

  // 4. API Endpoints
  app.use('/api', apiRouter);

  // 5. Frontend SPA Handling
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ALLVIBEZ11 Full-Stack Platform online at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal Server Boot Error:', err);
  process.exit(1);
});
