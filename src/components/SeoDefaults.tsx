import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const FALLBACK_SITE_URL = 'https://thirukkural.app';

const getSiteUrl = () => {
  const configured = import.meta.env.VITE_SITE_URL as string | undefined;
  return (configured || FALLBACK_SITE_URL).replace(/\/$/, '');
};

const SeoDefaults = () => {
  const location = useLocation();
  const siteUrl = getSiteUrl();

  const canonicalUrl = useMemo(() => {
    const path = location.pathname || '/';
    return `${siteUrl}${path}`;
  }, [location.pathname, siteUrl]);

  const websiteSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Thirukkural - Learn Tamil',
      url: siteUrl,
      inLanguage: ['ta', 'en'],
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/kurral/explore?query={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    }),
    [siteUrl],
  );

  return (
    <Helmet>
      <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
      <meta name="googlebot" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
      <meta property="og:site_name" content="Thirukkural - Learn Tamil" />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="ta_IN" />
      <meta property="og:url" content={canonicalUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      <link rel="alternate" hrefLang="ta" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
      <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
    </Helmet>
  );
};

export default SeoDefaults;
