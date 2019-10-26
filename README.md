# Epstein

In-memory search engine written in javascript.

> The story tells that the **Epstein Drive** is a modified fusion drive invented by Solomon Epstein around 130 years BXT (Before Extrasolar Technology) and it enabled humanity to travel beyond Earth and colonize the Inner Planets, the Asteroid Belt and outer planets due to its efficiency and power. "The Expanse"

## Setup

```bash
npm i epstein
```

## Usage

```javascript
import epstein from 'epstein';

const docs = [
  { title: 'Leviathan Awakes', number: 1 },
  { title: 'Calibans War', number: 2 },
  { title: 'Abaddons Gate', number: 3 },
];

const index = epstein(documents);
index.search('Cal');
// [ { title: 'Calibans War', number: 2 } ]
```

## Tests:

```bash
npm t
```
