import epstein from '.';

describe('index', () => {
  test('should have tokens from a simple object', () => {
    const docs = [{ title: 'Leviathan Awakes' }];

    const index = epstein(docs).getIndex();

    expect(index).toEqual({
      leviathan: { 0: [0] },
      awakes: { 0: [1] },
    });
  });

  test('should have token locations from a repeated words', () => {
    const docs = [
      { title: 'Leviathan Awakes Leviathan Awakes Awakes Leviathan' },
    ];

    const index = epstein(docs).getIndex();

    expect(index).toEqual({
      leviathan: { 0: [0, 2, 5] },
      awakes: { 0: [1, 3, 4] },
    });
  });

  test('should have tokens from many simple objects', () => {
    const docs = [{ title: 'Leviathan Awakes' }, { title: 'Calibans War' }];

    const index = epstein(docs).getIndex();

    expect(index).toEqual({
      leviathan: { 0: [0] },
      awakes: { 0: [1] },
      calibans: { 1: [0] },
      war: { 1: [1] },
    });
  });

  test('should have token locations from many simple objects with repeated words', () => {
    const docs = [{ title: 'Leviathan Awakes' }, { title: 'Awakes Leviathan' }];

    const index = epstein(docs).getIndex();

    expect(index).toEqual({
      leviathan: { 0: [0], 1: [1] },
      awakes: { 0: [1], 1: [0] },
    });
  });

  test('should not have an empty token', () => {
    const docs = [
      { title: '   leviathan', author: 'james   ' },
      { title: 'calibans   war', author: '   corey' },
    ];

    const index = epstein(docs).getIndex();

    expect(index['']).not.toBeDefined();
  });

  test('acceptance', () => {
    const docs = [
      {
        title: 'Leviathan Awakes',
        author: 'James Corey',
      },
      {
        title: 'Calibans War',
        author: 'James Corey',
      },
      {
        title: 'Abaddons Gate',
        author: 'James Corey',
      },
      {
        title: 'Leviathan War War',
        author: 'Corey James James',
      },
    ];

    const index = epstein(docs).getIndex();

    expect(index).toEqual({
      leviathan: { 0: [0], 3: [0] },
      awakes: { 0: [1] },
      calibans: { 1: [0] },
      war: { 1: [1], 3: [1, 2] },
      abaddons: { 2: [0] },
      gate: { 2: [1] },
      james: { 0: [0], 1: [0], 2: [0], 3: [1, 2] },
      corey: { 0: [1], 1: [1], 2: [1], 3: [0] },
    });
  });
});

describe('search', () => {
  const docs = [
    {
      title: 'Leviathan Awakes',
      author: 'James Corey',
    },
    {
      title: 'Calibans War',
      author: 'James Corey',
    },
    {
      title: 'Abaddons Gate',
      author: 'James Corey',
    },
    {
      title: 'Leviathan War War',
      author: 'Corey James James',
    },
  ];
  const index = epstein(docs);

  test('should return a all documents when search argument is a falsy value', () => {
    expect(index.search()).toEqual(docs);
    expect(index.search(0)).toEqual(docs);
    expect(index.search('')).toEqual(docs);
    expect(index.search(null)).toEqual(docs);
    expect(index.search(false)).toEqual(docs);
    expect(index.search(undefined)).toEqual(docs);
  });

  test('should return a list of one matching result when searching by one exact word', () => {
    expect(index.search('gate')).toEqual([
      {
        title: 'Abaddons Gate',
        author: 'James Corey',
      },
    ]);
  });

  test('should be case insensitive', () => {
    expect(index.search('Abaddons')).toEqual([
      {
        title: 'Abaddons Gate',
        author: 'James Corey',
      },
    ]);
  });

  test('should return a list of many matching results when searching by one exact word', () => {
    expect(index.search('war')).toEqual([
      {
        title: 'Calibans War',
        author: 'James Corey',
      },
      {
        title: 'Leviathan War War',
        author: 'Corey James James',
      },
    ]);
  });

  test('should return a list of many matching results when searching by many exact words', () => {
    expect(index.search('gate awakes')).toEqual([
      {
        title: 'Abaddons Gate',
        author: 'James Corey',
      },
      {
        title: 'Leviathan Awakes',
        author: 'James Corey',
      },
    ]);
  });

  test('should return the same list of results even when there are many matchings of the same word', () => {
    expect(index.search('leviathan war')).toEqual([
      {
        title: 'Leviathan Awakes',
        author: 'James Corey',
      },
      {
        title: 'Leviathan War War',
        author: 'Corey James James',
      },
      {
        title: 'Calibans War',
        author: 'James Corey',
      },
    ]);
  });

  test('should return an empty list when there isnt any match', () => {
    expect(index.search('beratna')).toEqual([]);
  });

  test.skip('acceptance', () => {
    expect(index.search('leviath')).toEqual([
      {
        title: 'Leviathan Awakes',
        author: 'James Corey',
      },
      {
        title: 'Leviathan War War',
        author: 'Corey James James',
      },
    ]);
  });
});
