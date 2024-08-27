const convertTitleCase = (str: string | undefined) => {
  if (!str) {
    return '';
  }

  return str
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

export default convertTitleCase;
