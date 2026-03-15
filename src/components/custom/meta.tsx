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
  return (
    <Helmet>
      <title>{title}</title>
      <link rel="icon" href={(favicon && `https://ioy.app${favicon}`) || "/favicon.ico"} type="image/x-icon" />
      <meta name="robots" content="index, follow" />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords || "gamedev,indiedev,games,game,web,webplatform,webgames,html"} />
      <meta name="author" content={author || "ioxy.app"} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`https://ioy.app${url}`} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={(banner && `https://ioy.app${banner}`) || "https://ioy.app/resources/banner.png"} />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={`https://ioy.app${url}`} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={(banner && `https://ioy.app${banner}`) || "https://ioy.app/resources/banner.png"} />
    </Helmet>
  );
}

export default Meta;