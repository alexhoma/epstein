const wordsToRemove = [
  'a',
  'as',
  'at',
  'an',
  'by',
  'be',
  'for',
  'of',
  'or',
  'to',
  'the',
  'that',
  'than',
  'is',
  'it',
  'its',
];

function createIndex(documents) {
  // return the same object but with its property values
  // already sanitized and tokenized
  const analyzedDocuments = documents.map(function analyze(doc) {
    return Object.entries(doc).reduce(function(
      accumulatedTokenizedDocument,
      [key, value],
    ) {
      value = value.replace(/ +/g, ' ').trim();
      value = value.toLowerCase();

      const tokenizedValue = value
        .split(' ')
        .filter(function removeCommonWords(value) {
          return !wordsToRemove.includes(value) && value;
        });

      return {
        ...accumulatedTokenizedDocument,
        [key]: tokenizedValue,
      };
    },
    {});
  });

  return analyzedDocuments.reduce(function createInvertedIndex(
    index,
    doc,
    documentId,
  ) {
    Object.entries(doc).forEach(function([, tokens]) {
      tokens.forEach(function(token, position) {
        if (!index[token] || !index[token][documentId]) {
          index = {
            ...index,
            [token]: {
              ...index[token],
              [documentId]: [position],
            },
          };

          return;
        }

        index = {
          ...index,
          [token]: {
            ...index[token],
            [documentId]: [...index[token][documentId], position],
          },
        };
      });
    });

    return index;
  },
  {});
}

export default function epstein(documents) {
  const index = createIndex(documents);

  return {
    getIndex() {
      return index;
    },
    search(query) {
      if (!query) {
        return documents;
      }

      const terms = query.split(' ');

      const documentIds = terms.reduce(function findDocumentIds(acc, term) {
        const matches = index[term] && Object.keys(index[term]);
        if (!matches) {
          return acc;
        }

        const documentIds = matches.filter(match => !acc.includes(match));

        return acc.concat(documentIds);
      }, []);

      return documentIds.map(documentId => documents[documentId]);
    },
  };
}
