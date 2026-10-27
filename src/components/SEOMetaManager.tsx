import React, { useEffect } from 'react';
import { Article, PublicSettingsPayload } from '../types';

interface SEOMetaManagerProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  article?: Article;
  publicSettings?: PublicSettingsPayload | null;
}

export const SEOMetaManager: React.FC<SEOMetaManagerProps> = ({
  title,
  description,
  image,
  url,
  article,
  publicSettings,
}) => {
  useEffect(() => {
    const siteTitle = title || publicSettings?.seo?.defaultMetaTitle || 'ALLVIBEZ11 - Global & African Entertainment News';
    const metaDesc = description || (article ? article.metaDescription || article.excerpt : publicSettings?.seo?.defaultMetaDescription || 'ALLVIBEZ11 is the premier portal for music, movies, Nollywood, Hollywood, celebrity news, and trending culture.');
    const ogImage = image || (article ? article.featuredImage : 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80');
    const pageUrl = url || window.location.href;

    document.title = siteTitle;

    // Helper to set or create meta tag
    const setMeta = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        if (isProperty) el.setAttribute('property', name);
        else el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', metaDesc);
    setMeta('og:title', siteTitle, true);
    setMeta('og:description', metaDesc, true);
    setMeta('og:image', ogImage, true);
    setMeta('og:url', pageUrl, true);
    setMeta('og:type', article ? 'article' : 'website', true);

    setMeta('twitter:title', siteTitle);
    setMeta('twitter:description', metaDesc);
    setMeta('twitter:image', ogImage);

    // Google Search Console verification meta tag
    if (publicSettings?.google?.verificationMethod === 'meta_tag' && publicSettings.google.verificationMetaTag) {
      let gscMeta = document.getElementById('gsc-meta-tag') as HTMLMetaElement | null;
      if (!gscMeta) {
        gscMeta = document.createElement('meta');
        gscMeta.id = 'gsc-meta-tag';
        gscMeta.name = 'google-site-verification';
        document.head.appendChild(gscMeta);
      }
      // If user pasted `<meta name="google-site-verification" content="XYZ" />`, extract content
      let contentVal = publicSettings.google.verificationMetaTag;
      const match = contentVal.match(/content=["']([^"']+)["']/i);
      if (match) {
        contentVal = match[1];
      }
      gscMeta.setAttribute('content', contentVal);
    }

    // Monetag verification meta tag
    if (publicSettings?.monetag?.verificationMethod === 'meta_tag' && publicSettings.monetag.verificationMetaTag) {
      let monetagMeta = document.getElementById('monetag-meta-tag') as HTMLMetaElement | null;
      if (!monetagMeta) {
        monetagMeta = document.createElement('meta');
        monetagMeta.id = 'monetag-meta-tag';
        monetagMeta.name = 'monetag';
        document.head.appendChild(monetagMeta);
      }
      let contentVal = publicSettings.monetag.verificationMetaTag;
      const match = contentVal.match(/content=["']([^"']+)["']/i);
      if (match) {
        contentVal = match[1];
      }
      monetagMeta.setAttribute('content', contentVal);
    }

    // Schema.org Structured Data
    let schemaScript = document.getElementById('structured-data') as HTMLScriptElement | null;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'structured-data';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }

    if (article) {
      const schemaData = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: article.title,
        description: article.excerpt || article.metaDescription,
        image: [article.featuredImage],
        datePublished: article.publishedAt,
        dateModified: article.updatedAt || article.publishedAt,
        author: {
          '@type': 'Person',
          name: article.authorName || 'ALLVIBEZ11 Editorial',
        },
        publisher: {
          '@type': 'Organization',
          name: 'ALLVIBEZ11',
          logo: {
            '@type': 'ImageObject',
            url: `${window.location.origin}/logo.svg`,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': pageUrl,
        },
      };
      schemaScript.textContent = JSON.stringify(schemaData);
    } else {
      const schemaData = {
        '@context': 'https://schema.org',
        '@type': 'NewsMediaOrganization',
        name: 'ALLVIBEZ11',
        url: window.location.origin,
        logo: `${window.location.origin}/logo.svg`,
        description: 'ALLVIBEZ11 is the premier digital entertainment magazine for music, movies, Nollywood, Hollywood, celebrity news, and trending culture.',
        sameAs: [
          publicSettings?.website?.socialLinks?.twitter,
          publicSettings?.website?.socialLinks?.instagram,
          publicSettings?.website?.socialLinks?.facebook,
          publicSettings?.website?.socialLinks?.youtube,
        ].filter(Boolean),
      };
      schemaScript.textContent = JSON.stringify(schemaData);
    }
  }, [title, description, image, url, article, publicSettings]);

  return null;
};
