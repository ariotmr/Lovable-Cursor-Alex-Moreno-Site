import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  structuredData?: Record<string, any> | Record<string, any>[];
}

const defaultDescription = "Structured personal training for busy professionals. Indoor studio and outdoor sessions in Barcelona.";
const defaultTitle = "Alex Moreno — Strength Training Barcelona";
const defaultImage = "/og-preview.png";

export const SEO = ({
  title = defaultTitle,
  description = defaultDescription,
  url = "https://alexmoreno.space",
  image = defaultImage,
  structuredData,
}: SEOProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
