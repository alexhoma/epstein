export function filterEmptySpaces(value) {
  return value.replace(/ +/g, ' ').trim();
}

export function filterSpecialChars(value) {
  const sanitized = value.replace(/(?!\w|\s)./g, '');
  return filterEmptySpaces(sanitized);
}

export function filterStopWords(stopWords) {
  return function(value) {
    return value
      .split(' ')
      .filter(word => !stopWords.includes(word.toLowerCase()))
      .join(' ');
  };
}

export function tokenize(value) {
  return value.toLowerCase().split(' ');
}
