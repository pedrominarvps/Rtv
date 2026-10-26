export interface SeoOptions {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  jsonLd?: Record<string, any>;
}

export function updatePageSeo({
  title,
  description,
  image,
  url,
  type = 'website',
  jsonLd,
}: SeoOptions) {
  // Update browser tab title
  const fullTitle = title ? `${title} · RukaTV+` : 'RukaTV+ · Stream Originals & Live TV';
  document.title = fullTitle;

  const setMeta = (nameOrProperty: string, content?: string) => {
    if (!content) return;
    const isProp = nameOrProperty.startsWith('og:') || nameOrProperty.startsWith('twitter:');
    const selector = isProp ? `meta[property="${nameOrProperty}"]` : `meta[name="${nameOrProperty}"]`;
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      if (isProp) {
        el.setAttribute('property', nameOrProperty);
      } else {
        el.setAttribute('name', nameOrProperty);
      }
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  const defaultDesc = 'Stream award-winning Ruka Originals, blockbuster movies, and TV Season live broadcast channels on RukaTV+.';
  const metaDesc = description || defaultDesc;

  setMeta('description', metaDesc);
  setMeta('og:title', fullTitle);
  setMeta('og:description', metaDesc);
  setMeta('og:type', type);
  setMeta('twitter:title', fullTitle);
  setMeta('twitter:description', metaDesc);
  setMeta('twitter:card', 'summary_large_image');

  if (image) {
    setMeta('og:image', image);
    setMeta('twitter:image', image);
  }

  if (url) {
    setMeta('og:url', url);
  }

  // Schema.org structured data for SEO indexing
  let scriptEl = document.querySelector('script#seo-jsonld');
  if (jsonLd) {
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'seo-jsonld';
      scriptEl.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(jsonLd);
  } else if (scriptEl) {
    scriptEl.remove();
  }
}
