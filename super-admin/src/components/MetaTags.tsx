/**
 * Meta Tags Component
 * SEO meta tags for pages
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getPageMeta } from '../constants/routes';

export interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: 'summary' | 'summary_large_image';
}

export function MetaTags({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  twitterCard = 'summary'
}: MetaTagsProps) {
  const location = useLocation();
  
  useEffect(() => {
    // Get default meta from route
    const routeMeta = getPageMeta(location.pathname);
    
    // Use provided props or fall back to route meta
    const finalTitle = title || routeMeta.title;
    const finalDescription = description || routeMeta.description;
    const finalKeywords = keywords || routeMeta.keywords;
    const finalOgTitle = ogTitle || finalTitle;
    const finalOgDescription = ogDescription || finalDescription;
    const finalOgUrl = ogUrl || window.location.href;
    const finalOgImage = ogImage || '/logo-black-horizontal.png';

    // Update document title
    document.title = finalTitle;

    // Update meta description
    updateMetaTag('description', finalDescription);
    updateMetaTag('name', 'description', finalDescription);

    // Update keywords
    if (finalKeywords.length > 0) {
      updateMetaTag('name', 'keywords', finalKeywords.join(', '));
    }

    // Update Open Graph tags
    updateMetaTag('property', 'og:title', finalOgTitle);
    updateMetaTag('property', 'og:description', finalOgDescription);
    updateMetaTag('property', 'og:url', finalOgUrl);
    updateMetaTag('property', 'og:image', finalOgImage);
    updateMetaTag('property', 'og:type', 'website');

    // Update Twitter Card tags
    updateMetaTag('name', 'twitter:card', twitterCard);
    updateMetaTag('name', 'twitter:title', finalOgTitle);
    updateMetaTag('name', 'twitter:description', finalOgDescription);
    updateMetaTag('name', 'twitter:image', finalOgImage);

    // Update canonical URL
    updateCanonicalUrl(finalOgUrl);

  }, [location.pathname, title, description, keywords, ogTitle, ogDescription, ogImage, ogUrl, twitterCard]);

  return null; // This component doesn't render anything
}

/**
 * Update or create a meta tag
 */
function updateMetaTag(attribute: string, value: string, content: string) {
  const selector = `meta[${attribute}="${value}"]`;
  let metaTag = document.querySelector(selector) as HTMLMetaElement;

  if (!metaTag) {
    metaTag = document.createElement('meta');
    metaTag.setAttribute(attribute, value);
    document.head.appendChild(metaTag);
  }

  metaTag.setAttribute('content', content);
}

/**
 * Update canonical URL
 */
function updateCanonicalUrl(url: string) {
  let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;

  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }

  canonicalLink.setAttribute('href', url);
}
