import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

/**
 * Meta tags
 * @example
 * return <Meta />
*/
const Meta: React.FC<{
  title: string;
  description: string;
  keywords?: string;
  author?: string;
  banner?: string;
  favicon?: string;
  url: string;
}> = ({
  title,
  description,
  keywords,
  author,
  banner,
  favicon,
  url
}) => {
  const [ localData, setLocalData ] = useState<Record<string, string>>(null);

  useEffect(() => {
    setLocalData({
      title,
      description,
      keywords,
      author,
      banner,
      favicon,
      url
    });
  }, [
    title,
    description,
    keywords,
    author,
    banner,
    favicon,
    url
  ]);

  return (
    <Helmet>
      <title>{localData?.title || "ioy.app"}</title>
      <link rel="icon" href={(localData?.favicon && `https://ioy.app${localData?.favicon}`) || "/favicon.ico"} type="image/x-icon" />
      <meta name="robots" content="index, follow" />
      <meta name="description" content={localData?.description} />
      <meta name="keywords" content={localData?.keywords || "gamedev,indiedev,games,game,web,webplatform,webgames,html"} />
      <meta name="author" content={localData?.author || "ioy.app"} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`https://ioy.app${localData?.url}`} />
      <meta property="og:title" content={localData?.title || "ioy.app"} />
      <meta property="og:description" content={localData?.description} />
      <meta property="og:image" content={(localData?.banner && `https://ioy.app${localData?.banner}`) || "https://ioy.app/resources/banner.png"} />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={`https://ioy.app${localData?.url}`} />
      <meta property="twitter:title" content={localData?.title || "ioy.app"} />
      <meta property="twitter:description" content={localData?.description} />
      <meta property="twitter:image" content={(localData?.banner && `https://ioy.app${localData?.banner}`) || "https://ioy.app/resources/banner.png"} />
    </Helmet>
  );
}

export default Meta;