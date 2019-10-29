export function filterEmptySpaces(value) {
  return value.replace(/ +/g, ' ').trim();
}

export function filterStopWords(value) {
  const stopWords = [
    'a',
    'an',
    'and',
    'are',
    'as',
    'at',
    'be',
    'but',
    'by',
    'for',
    'if',
    'in',
    'into',
    'is',
    'it',
    'no',
    'not',
    'of',
    'on',
    'or',
    'such',
    'that',
    'the',
    'their',
    'then',
    'there',
    'these',
    'they',
    'this',
    'to',
    'was',
    'will',
    'with',
  ];

  return value
    .split(' ')
    .filter(word => !stopWords.includes(word.toLowerCase()))
    .join(' ');
}

export function tokenize(value) {
  return value.toLowerCase().split(' ');
}
