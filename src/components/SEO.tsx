import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  noindex?: boolean;
  structuredData?: Record<string, any> | Record<string, any>[];
}

const SITE_URL = "https://alexmoreno.space";
const defaultDescription = "Personal strength and conditioning training in Barcelona by Alex Moreno. Indoor studio and outdoor sessions for busy professionals. Book your session today.";
const defaultTitle = "Alex Moreno — Strength & Conditioning Coach | Barcelona";
const defaultImage = `${SITE_URL}/og-preview.png`;

export const SEO = ({
  title = defaultTitle,
  description = defaultDescription,
  url = SITE_URL,
  image = defaultImage,
  noindex = false,
  structuredData,
}: SEOProps) => {
  // Ensure image is absolute for social previews
  const absoluteImage = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      <html lang="en" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Alex Moreno — Strength & Conditioning" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />

      {/* JSON-LD Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
