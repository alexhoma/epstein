// Index example
// {
//   // token
//   leviathan: {
//     // document-id: [token-position]
//     0: [0]
//   },
//   awakes: {
//     0: [1]
//   },
// }

function epstein(documents) {
  let index = {};

  documents.forEach(function(doc, documentId) {
    Object.entries(doc).forEach(function([, fieldContent]) {
      const tokens = fieldContent.split(' ');

      tokens.forEach(function(token, position) {
        token = token.toLowerCase();

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
  });

  return {
    getIndex() {
      return index;
    },
  };
}

export default epstein;
