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
        .split(' ')
        .map(token => token.toLowerCase());

      return {
        ...accumulatedTokenizedDocument,
        [key]: tokenizedValue,
      };
    },
    {});
  });

  // create a Term Frquency index
  return tokenizedDocuments.reduce(function(index, doc, documentId) {
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
  }, {});
}

export default function epstein(documents) {
  const index = createIndex(documents);

  return {
    getIndex() {
      return index;
    },
  };
}
