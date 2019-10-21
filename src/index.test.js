import epstein from '.';

test('search', () => {
  const docs = ['bar'];

  const index = epstein(docs);
  const results = index.search('bar');

  expect(results).toEqual(['bar']);
});
