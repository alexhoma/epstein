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

  test('should have all tokens in lowercase', () => {
    const docs = [{ title: 'LeviAThaN AwakeS' }];

    const index = epstein(docs).getIndex();

    expect(index.leviathan).toBeDefined();
    expect(index.awakes).toBeDefined();
  });

  test('should not have an empty token', () => {
    const docs = [{ title: '   leviathan  awakes  ' }];

    const index = epstein(docs).getIndex();

    expect(index['']).not.toBeDefined();
  });

  test('should not have any stopword token (case inensitive)', () => {
    const docs = [{ title: 'The leviathan is awake' }];

    const index = epstein(docs).getIndex();

    expect(index['the']).not.toBeDefined();
    expect(index['is']).not.toBeDefined();
    expect(index['']).not.toBeDefined();
  });

  test('should have tokens that appear in the "search" field in settings', () => {
    const docs = [{ title: 'Leviathan', author: 'James Corey' }];

    const index = epstein(docs, { search: ['title'] }).getIndex();

    expect(index).toEqual({
      leviathan: { 0: [0] },
    });
  });

  test('should have tokens that appear in the "exact" field in settings', () => {
    const docs = [{ title: 'leviathan', author: 'James Corey' }];

    const index = epstein(docs, { exact: ['title'] }).getIndex();

    expect(index).toEqual({
      leviathan: { 0: [0] },
    });
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
    const docs = [{ title: 'Abaddons Gate', author: 'James Corey' }];

    const index = epstein(docs);

    expect(index.search('gate')).toEqual([
      { title: 'Abaddons Gate', author: 'James Corey' },
    ]);
  });

  test('should be case insensitive', () => {
    const docs = [{ title: 'Abaddons Gate', author: 'James Corey' }];

    const index = epstein(docs);

    expect(index.search('Abaddons')).toEqual([
      { title: 'Abaddons Gate', author: 'James Corey' },
    ]);
  });

  test('should not search by stopwords', () => {
    const docs = [
      { title: 'The Abaddons is a Gate', author: 'A James Corey' },
      { title: 'Calibans War', author: 'James Corey' },
    ];

    const index = epstein(docs);

    expect(index.search('the calibans is a war')).toEqual([
      { title: 'Calibans War', author: 'James Corey' },
    ]);
  });

  test('should return a list of many matching results when searching by one exact word', () => {
    const docs = [
      { title: 'Leviathan Awakes', author: 'James Corey' },
      { title: 'Calibans War', author: 'James Corey' },
      { title: 'Leviathan War', author: 'Corey James' },
    ];

    const index = epstein(docs);

    expect(index.search('war')).toEqual([
      { title: 'Calibans War', author: 'James Corey' },
      { title: 'Leviathan War', author: 'Corey James' },
    ]);
  });

  test('should return a list of many matching results when searching by many exact words', () => {
    const docs = [
      { title: 'Leviathan Awakes', author: 'James Corey' },
      { title: 'Calibans War', author: 'James Corey' },
      { title: 'Abaddons Gate', author: 'James Corey' },
    ];

    const index = epstein(docs);

    expect(index.search('gate awakes')).toEqual([
      { title: 'Abaddons Gate', author: 'James Corey' },
      { title: 'Leviathan Awakes', author: 'James Corey' },
    ]);
  });

  test('should return the same list of results even when there are many matchings of the same word', () => {
    const docs = [
      { title: 'Leviathan Awakes', author: 'James Corey' },
      { title: 'Calibans War', author: 'James Corey' },
      { title: 'Abaddons Gate', author: 'James Corey' },
      { title: 'Leviathan War War', author: 'Corey James James' },
    ];

    const index = epstein(docs);

    expect(index.search('leviathan war')).toEqual([
      { title: 'Leviathan Awakes', author: 'James Corey' },
      { title: 'Leviathan War War', author: 'Corey James James' },
      { title: 'Calibans War', author: 'James Corey' },
    ]);
  });

  test('should return an empty list when there isnt any match', () => {
    const docs = [{ title: 'Leviathan Awakes', author: 'James Corey' }];

    const index = epstein(docs);

    expect(index.search('beratna')).toEqual([]);
  });

  test.skip('acceptance', () => {
    const docs = [
      { title: 'Leviathan Awakes', author: 'James Corey' },
      { title: 'Calibans War', author: 'James Corey' },
      { title: 'Abaddons Gate', author: 'James Corey' },
      { title: 'Leviathan War War', author: 'Corey James James' },
    ];

    const index = epstein(docs);

    expect(index.search('leviath')).toEqual([
      { title: 'Leviathan Awakes', author: 'James Corey' },
      { title: 'Leviathan War War', author: 'Corey James James' },
    ]);
  });
});
