# Epstein

In-memory search engine written in javascript.

> Tells the story that the **Epstein Drive** is a modified fusion drive invented by Solomon Epstein around 130 years BXT (Before Extrasolar Technology) and it enabled humanity to travel beyond Earth and colonize the Inner Planets, the Asteroid Belt and outer planets due to its efficiency and power. "The Expanse"

## Setup

```bash
npm i epstein
```

## Basic usage

```javascript
import epstein from 'epstein';

const docs = [
  { title: 'Leviathan Awakes', number: 1 },
  { title: 'Calibans War', number: 2 },
  { title: 'Abaddons Gate', number: 3 },
];

const index = epstein(documents);
index.search('Cal');
// [
//   { title: 'Calibans War', number: 2 }
// ]
```

## API reference

### `epstein()`

This is the main function of `epstein` library. It will process
all the documents and return an index to execute ll your queries.

```javascript
const index = epstein(docs, {
  /* opts (not finished yet) - by default everything will be searchable */
  searchable: ['title', 'content'],
  facetable: ['author', 'stars'],
  exactMatch: ['isbn'],
});
```

### `index.search()`

This is the search function of epstein. It will allow you to
search for any document in that index.

```javascript
const results = index.search('query string', {
  /* opts with default values (not finished yet) */
  filters: [],
  highlight: false,
  fuzzy: true,
});
```
