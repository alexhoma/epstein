# Epstein

In-memory search engine written in javascript.

> Tells the story that the **Epstein Drive** is a modified fusion drive invented by Solomon Epstein around 130 years BXT (Before Extrasolar Technology) and it enabled humanity to travel beyond Earth and colonize the Inner Planets, the Asteroid Belt and outer planets due to its efficiency and power. *"The Expanse"*

![Epstein drive one animation](./epstein-drive.gif)

## :wave: Newcomer

Install it:

```bash
npm i epstein
```

Basic usage:

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

## :scroll: API reference

### `epstein()`

This is the main function of `epstein` library. It will analyze all the documents and create an index to optimize your search.

```javascript
const settings = {
  search: ['title', 'content'],
  exact: ['isbn'],
};

const index = epstein(documents, settings);
```

#### `documents`:

A list of documents that you'll want to search for. Limitations by now:

- All documents must be objects with properties in a single level. (not nested)
- It does not support properties with arrays.

#### `settings`:

A map of settings to configure the way your documents will be analyzed.

| Attribute | Type                    | Description                                                                           |
| --------- | ----------------------- | ------------------------------------------------------------------------------------- |
| search    | `Array<string>`         | Attributes that will be searchable. When indexing, they'll be filtered and tokenized. |
| exact     | `Array<string\|number>` | Attributes that will be exact matched, they won't be filtered or tokenized.           |

### `index.search()`

This is the search function of epstein. It will allow you to
search for any document in that index.

```javascript
const results = index.search('query string');
```

## :bulb: Ideas

A list of todos that will be nice to have in the future. Ordered by priority.

- Stemmer and synonyms when indexing (support languages)
- Fuzzy search
- Highlight search matches
- Facets
- Search filters
