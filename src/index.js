import stopWords from './stopwords';
import {
  filterEmptySpaces,
  filterSpecialChars,
  filterStopWords,
  tokenize,
} from './analyzers';

function analyze(documents, settings, analyzers) {
  const { exact: exactSearchAttributes } = settings;

  return documents.map(function mapDocuments(document) {
    return Object.entries(document).reduce(function mapDocumentProperties(
      tokenizedDocument,
      [key, value],
    ) {
      if (exactSearchAttributes.includes(key)) {
        return {
          ...tokenizedDocument,
          [key]: String(value).toLowerCase(),
        };
      }

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
  if (!settings.search.length && !settings.exact.length) {
    return documents;
  }

  return documents.map(function mapDocuments(document) {
    const { search, exact } = settings;
    const searchableAttributes = [...search, ...exact];

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
    Object.entries(doc).forEach(function([documentProperty, tokens]) {
      tokens = Array.isArray(tokens) ? tokens : [tokens];
      tokens.forEach(function(token, position) {
        if (!index[token] || !index[token][documentId]) {
          index = {
            ...index,
            [token]: {
              ...index[token],
              [documentId]: {
                [documentProperty]: [position],
              },
            },
          };
          return;
        }

        if (!index[token][documentId][documentProperty]) {
          index = {
            ...index,
            [token]: {
              ...index[token],
              [documentId]: {
                ...index[token][documentId],
                [documentProperty]: [position],
              },
            },
          };
          return;
        }

        index = {
          ...index,
          [token]: {
            ...index[token],
            [documentId]: {
              ...index[token][documentId],
              [documentProperty]: [
                ...index[token][documentId][documentProperty],
                position,
              ],
            },
          },
        };
      });
    });

    return index;
  }, {});
}

function createIndex(documents, settings) {
  const filteredDocuments = reduceDocuments(documents, settings);
  const analyzedDocuments = analyze(filteredDocuments, settings, [
    filterEmptySpaces,
    filterSpecialChars,
    filterStopWords(stopWords),
    tokenize,
  ]);

  return createInvertedIndex(analyzedDocuments);
}

export default function epstein(documents, settings = {}) {
  settings = { search: [], exact: [], ...settings };
  const index = createIndex(documents, settings);

  return {
    getIndex() {
      return index;
    },
    search(query) {
      if (!query) {
        return documents;
      }

      const terms = [filterEmptySpaces, tokenize].reduce(
        function analyzeQueryString(value, analyzer) {
          return analyzer(value);
        },
        query,
      );

      // find document matches by each term
      const foundDocumentsByTerm = terms
        .map(function mapTerms(term) {
          const documentIdMatches = index[term] && Object.keys(index[term]);
          if (!documentIdMatches) {
            return;
          }

          return documentIdMatches.reduce(function accumulateTermMatches(
            accDocs,
            docId,
          ) {
            return [
              ...accDocs,
              {
                id: docId,
                terms: [term],
              },
            ];
          },
          []);
        })
        .filter(function removeUndefinedMatches(match) {
          return !!match;
        });

      // reduce document matches
      const flattenFoundDocs = [].concat.apply([], foundDocumentsByTerm);
      const documentCandidates = flattenFoundDocs.reduce(
        function reduceTermMatchesByDocumentId(acc, doc) {
          if (!acc[doc.id]) {
            return { ...acc, [doc.id]: doc };
          }

          return {
            ...acc,
            [doc.id]: {
              ...acc[doc.id],
              terms: [...acc[doc.id].terms, ...doc.terms],
            },
          };
        },
        {},
      );

      return Object.values(documentCandidates).map(
        document => documents[document.id],
      );
    },
  };
}
