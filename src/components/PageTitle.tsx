import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Thirukkural - Learn Tamil';
const DEFAULT_DESCRIPTION = 'Interactive Tamil learning platform with Thirukkural, Tamil letters, exercises, and guided lessons.';
const DEFAULT_IMAGE = 'https://thirukkural.app/android-chrome-512x512.png';
const FALLBACK_SITE_URL = 'https://thirukkural.app';

interface PageTitleProps {
  /** Page-specific title. If omitted, only the site name is shown. */
  title?: string;
  description?: string;
  /** Canonical URL path, e.g. "/kurral/10" */
  path?: string;
  noIndex?: boolean;
}

export default function PageTitle({ title, description, path, noIndex = false }: PageTitleProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const siteUrl = ((import.meta.env.VITE_SITE_URL as string | undefined) || FALLBACK_SITE_URL).replace(/\/$/, '');
  const resolvedPath = path || (typeof window !== 'undefined' ? window.location.pathname : undefined);
  const canonicalUrl = resolvedPath ? `${siteUrl}${resolvedPath}` : undefined;
  const resolvedDescription = description || DEFAULT_DESCRIPTION;
  const robotsContent = noIndex
    ? 'noindex,nofollow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'
    : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={resolvedDescription} />
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="og:image" content={DEFAULT_IMAGE} />
      <meta property="og:image:alt" content="Thirukkural Learn Tamil" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={resolvedDescription} />
      <meta name="twitter:image" content={DEFAULT_IMAGE} />
    </Helmet>
  );
}
