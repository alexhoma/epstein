function createIndex(documents) {
  // return the same object but with its property values
  // already sanitized and tokenized
  const tokenizedDocuments = documents.map(function tokenize(doc) {
    return Object.entries(doc).reduce(function(
      accumulatedTokenizedDocument,
      [key, value],
    ) {
      const tokenizedValue = value
        .replace(/ +/g, ' ')
        .trim()
        .toLowerCase()
        .split(' ');

      return {
        ...accumulatedTokenizedDocument,
        [key]: tokenizedValue,
      };
    },
    {});
  });

  return tokenizedDocuments.reduce(function createInvertedIndex(
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
      const term = index[query];

      return Object.keys(term).map(documentId => documents[documentId]);
    },
  };
}
