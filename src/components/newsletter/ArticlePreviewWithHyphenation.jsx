
import React from 'react';

const ArticlePreviewWithHyphenation = ({ content }) => {
  return (
    <article
      lang="en"
      className="hyphens-auto break-words"
      dangerouslySetInnerHTML={{
        __html: content.replace(/<br\s*\/?>/gi, ' '),
      }}
    />
  );
};

export default ArticlePreviewWithHyphenation;
