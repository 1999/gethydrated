export const buildTagsList = (tags: string): string[] => {
  return tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
};

export const serialiseTagsList = (tags: string[]): string => {
  return tags.join(', ');
};
