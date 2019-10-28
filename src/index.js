import { filterEmptySpaces, filterStopWords, tokenize } from './analyzers';

function analyze(documents, analyzers) {
  return documents.map(function mapDocuments(document) {
    return Object.entries(document).reduce(function mapDocumentProperties(
      tokenizedDocument,
      [key, value],
    ) {
      value = analyzers.reduce(function executeAnalyzers(property, analyzer) {
        return analyzer(property);
      }, value);

      return {
        ...tokenizedDocument,
        [key]: value,
      };
    },
    {});
  });
}

function createInvertedIndex(documents) {
  return documents.reduce(function invertDocuments(index, doc, documentId) {
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

function createIndex(documents) {
  const analyzedDocuments = analyze(documents, [
    filterEmptySpaces,
    filterStopWords,
    tokenize,
  ]);

  return createInvertedIndex(analyzedDocuments);
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

      const terms = query.toLowerCase().split(' ');

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
