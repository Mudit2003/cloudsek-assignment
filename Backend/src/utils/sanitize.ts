import sanitizeHtml from 'sanitize-html';

export const sanitizeContent = (content: string): string => {
  return sanitizeHtml(content, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'video', 'p', 'strong', 'em']),
    allowedAttributes: {
      '*': ['style', 'class'],
      'img': ['src'],
      'a': ['href']
    },
    allowedSchemes: ['http', 'https', 'mailto']
  });
};
