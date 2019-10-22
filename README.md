# Epstein

In memory search engine written in javascript.

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
const result = index.search('Cal');

console.log(result);
// [
//   { title: 'Calibans War', number: 2 },
// ]
```

## Tests:

```bash
npm t
```
