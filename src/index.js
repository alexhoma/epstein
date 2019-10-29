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

function reduceDocuments(documents, settings) {
  if (!settings.search) {
    return documents;
  }

  return documents.map(function mapDocuments(document) {
    const { search: searchableAttributes } = settings;

    return Object.entries(document).reduce(function filterDocumentProperties(
      filteredDocument,
      [propKey, propValue],
    ) {
      if (!searchableAttributes.includes(propKey)) {
        return filteredDocument;
      }

      return {
        ...filteredDocument,
        [propKey]: propValue,
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

function createIndex(documents, settings) {
  const filteredDocuments = reduceDocuments(documents, settings);
  const analyzedDocuments = analyze(filteredDocuments, [
    filterEmptySpaces,
    filterStopWords,
    tokenize,
  ]);

  return createInvertedIndex(analyzedDocuments);
}

export default function epstein(documents, settings = {}) {
  const index = createIndex(documents, settings);

  return {
    getIndex() {
      return index;
    },
    search(query) {
      if (!query) {
        return documents;
      }

      function analyze(string, analyzers) {
        return analyzers.reduce((value, analyzer) => analyzer(value), string);
      }

      const terms = analyze(query, [filterEmptySpaces, tokenize]);

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
