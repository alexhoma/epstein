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

export function tokenizeByNGram(value) {
  return value
    .toLowerCase()
    .split(' ')
    .reduce(function tokenizeWordsWithNGram(accumulatedTokenizedWords, word) {
      const tokenizedLetters = [...word]
        .reduce(function tokenizeLetters(accumulatedTokenizedLetters, letter) {
          if (accumulatedTokenizedLetters.length === 0) {
            return [letter];
          }
          const lastLetter =
            accumulatedTokenizedLetters[accumulatedTokenizedLetters.length - 1];
          return [...accumulatedTokenizedLetters, `${lastLetter}${letter}`];
        }, [])
        .join(',');

      return [...accumulatedTokenizedWords, tokenizedLetters];
    }, []);
}
