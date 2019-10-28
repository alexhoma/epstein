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

// export function tokenizeByNGram(value) {
//   return value
//     .toLowerCase()
//     .split(' ')
//     .reduce(function tokenizeWordsWithNGram(accumulatedTokenizedWords, word) {
//       const tokenizedLetters = [...word].reduce(function tokenizeLetters(
//         accumulatedTokenizedLetters,
//         letter,
//       ) {
//         if (accumulatedTokenizedLetters.length === 0) {
//           return [letter];
//         }
//         const lastLetter =
//           accumulatedTokenizedLetters[accumulatedTokenizedLetters.length - 1];
//         return [...accumulatedTokenizedLetters, `${lastLetter}${letter}`];
//       },
//       []);

//       return [...accumulatedTokenizedWords, ...tokenizedLetters];
//     }, []);
// }
