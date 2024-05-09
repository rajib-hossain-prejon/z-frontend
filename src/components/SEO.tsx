import React from 'react';
import { useSiteMetadata } from '../hooks/useSiteMetadata';

interface ISeoProps {
  title?: string;
  description?: string;
  pathname?: string;
  children?: React.ReactNode;
}

export const SEO: React.FC<ISeoProps> = ({ title, description, children }) => {
  const {
    title: defaultTitle,
    description: defaultDescription,
    image,
  } = useSiteMetadata();

  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    image: image,
  };

  return (
    <>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="image" content={seo.image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
      <link rel="icon" href="/favicon.ico" />
      {children}
    </>
  );
};
