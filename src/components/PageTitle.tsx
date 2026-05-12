import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Thirukkural - Learn Tamil';

interface PageTitleProps {
  /** Page-specific title. If omitted, only the site name is shown. */
  title?: string;
  description?: string;
  /** Canonical URL path, e.g. "/kurral/10" */
  path?: string;
}

export default function PageTitle({ title, description, path }: PageTitleProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const canonicalUrl = path ? `https://thirukkural.app${path}` : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      {title && <meta property="og:title" content={fullTitle} />}
      {description && <meta property="og:description" content={description} />}
    </Helmet>
  );
}
