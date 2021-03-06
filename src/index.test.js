import epstein from '.';

describe('index', () => {
  describe('with defaults', () => {
    test('should have one single token from a simple object', () => {
      const docs = [{ title: 'Leviathan' }];

      const index = epstein(docs).getIndex();

      expect(index).toEqual({
        leviathan: { 0: { title: [0] } },
      });
    });

    test('should have many tokens from a simple object', () => {
      const docs = [{ title: 'Leviathan Awakes' }];

      const index = epstein(docs).getIndex();

      expect(index).toEqual({
        leviathan: { 0: { title: [0] } },
        awakes: { 0: { title: [1] } },
      });
    });

    test('should have token locations from a repeated words', () => {
      const docs = [
        { title: 'Leviathan Awakes Leviathan Awakes Awakes Leviathan' },
      ];

      const index = epstein(docs).getIndex();

      expect(index).toEqual({
        leviathan: { 0: { title: [0, 2, 5] } },
        awakes: { 0: { title: [1, 3, 4] } },
      });
    });

    test('should have tokens from many simple objects', () => {
      const docs = [{ title: 'Leviathan Awakes' }, { title: 'Calibans War' }];

      const index = epstein(docs).getIndex();

      expect(index).toEqual({
        leviathan: { 0: { title: [0] } },
        awakes: { 0: { title: [1] } },
        calibans: { 1: { title: [0] } },
        war: { 1: { title: [1] } },
      });
    });

    test('should have token locations from many simple objects with repeated words', () => {
      const docs = [
        { title: 'Leviathan Awakes' },
        { title: 'Awakes Leviathan' },
      ];

      const index = epstein(docs).getIndex();

      expect(index).toEqual({
        leviathan: { 0: { title: [0] }, 1: { title: [1] } },
        awakes: { 0: { title: [1] }, 1: { title: [0] } },
      });
    });

    test('should have repeated words in different document props', () => {
      const docs = [{ title: 'Leviathan James', author: 'James' }];

      const index = epstein(docs).getIndex();

      expect(index).toEqual({
        leviathan: { 0: { title: [0] } },
        james: { 0: { title: [1], author: [0] } },
      });
    });
  });

  describe('with settings', () => {
    test('should have tokens that appear in the "search" field in settings', () => {
      const docs = [{ title: 'Leviathan', author: 'James Corey' }];

      const index = epstein(docs, { search: ['title'] }).getIndex();

      expect(index).toEqual({
        leviathan: { 0: { title: [0] } },
      });
    });

    test('should have tokens that appear in the "exact" field in settings', () => {
      const docs = [{ title: 'leviathan', author: 'James Corey' }];

      const index = epstein(docs, { exact: ['title'] }).getIndex();

      expect(index).toEqual({
        leviathan: { 0: { title: [0] } },
      });
    });

    test('should have "exact" tokens indexed without filter and token analyzing (only lowercased)', () => {
      const docs = [{ title: 'Leviathan Awakes', isbn: 'IS-97#25' }];

      const index = epstein(docs, { exact: ['isbn'] }).getIndex();

      expect(index).toEqual({
        'is-97#25': { 0: { isbn: [0] } },
      });
    });

    test('should have "exact" tokens indexed without lowercase when value is only an integer', () => {
      const docs = [{ title: 'Leviathan Awakes', isbn: 12345 }];

      const index = epstein(docs, { exact: ['isbn'] }).getIndex();

      expect(index).toEqual({
        12345: { 0: { isbn: [0] } },
      });
    });
  });

  describe('filtering and tokenization', () => {
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

    test('should not have a special character token', () => {
      const docs = [{ title: 'leviathan awakes.' }];

      const index = epstein(docs).getIndex();

      expect(index['awakes.']).not.toBeDefined();
    });

    test('should not have any stopword token (case inensitive)', () => {
      const docs = [{ title: 'The leviathan is awake' }];

      const index = epstein(docs).getIndex();

      expect(index['the']).not.toBeDefined();
      expect(index['is']).not.toBeDefined();
      expect(index['']).not.toBeDefined();
    });
  });

  test('acceptance', () => {
    const docs = [
      {
        title: 'Leviathan James Awakes',
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
      leviathan: { 0: { title: [0] }, 3: { title: [0] } },
      awakes: { 0: { title: [2] } },
      calibans: { 1: { title: [0] } },
      war: { 1: { title: [1] }, 3: { title: [1, 2] } },
      abaddons: { 2: { title: [0] } },
      gate: { 2: { title: [1] } },
      james: {
        0: { title: [1], author: [0] },
        1: { author: [0] },
        2: { author: [0] },
        3: { author: [1, 2] },
      },
      corey: {
        0: { author: [1] },
        1: { author: [1] },
        2: { author: [1] },
        3: { author: [0] },
      },
    });
  });
});

describe('search', () => {
  function ignoreOrder(array) {
    return new Set(array);
  }

  test('should return a all documents when search argument is a falsy value', () => {
    const docs = [
      { title: 'Leviathan Awakes', author: 'James Corey' },
      { title: 'Calibans War', author: 'James Corey' },
      { title: 'Abaddons Gate', author: 'James Corey' },
      { title: 'Leviathan War War', author: 'Corey James James' },
    ];

    const index = epstein(docs);

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
    const result = index.search('war');

    expect(ignoreOrder(result)).toEqual(
      ignoreOrder([
        { title: 'Calibans War', author: 'James Corey' },
        { title: 'Leviathan War', author: 'Corey James' },
      ]),
    );
  });

  test('should return a list of many matching results when searching by many exact words', () => {
    const docs = [
      { title: 'Leviathan Awakes', author: 'James Corey' },
      { title: 'Calibans War', author: 'James Corey' },
      { title: 'Abaddons Gate', author: 'James Corey' },
    ];

    const index = epstein(docs);
    const result = index.search('gate awakes');

    expect(ignoreOrder(result)).toEqual(
      ignoreOrder([
        { title: 'Abaddons Gate', author: 'James Corey' },
        { title: 'Leviathan Awakes', author: 'James Corey' },
      ]),
    );
  });

  test('should return the same list of results even when there are many matchings of the same word', () => {
    const docs = [
      { title: 'Leviathan Awakes', author: 'James Corey' },
      { title: 'Calibans War', author: 'James Corey' },
      { title: 'Abaddons Gate', author: 'James Corey' },
      { title: 'Leviathan War War', author: 'Corey James James' },
    ];

    const index = epstein(docs);
    const result = index.search('leviathan war');

    expect(ignoreOrder(result)).toEqual(
      ignoreOrder([
        { title: 'Leviathan Awakes', author: 'James Corey' },
        { title: 'Leviathan War War', author: 'Corey James James' },
        { title: 'Calibans War', author: 'James Corey' },
      ]),
    );
  });

  test('should return an empty list when there isnt any match', () => {
    const docs = [{ title: 'Leviathan Awakes', author: 'James Corey' }];

    const index = epstein(docs);

    expect(index.search('beratna')).toEqual([]);
  });

  describe.skip('ranking', () => {
    test('should rank higher matches that appear in priority document props', () => {
      const docs = [
        { title: 'Leviathan awakes', author: 'James' },
        { title: 'Calibans War', author: 'Leviathan' },
      ];

      const index = epstein(docs);
      const results = index.search('leviathan');

      expect(results).toEqual([
        { title: 'Leviathan awakes', author: 'James' },
        { title: 'Calibans War', author: 'Leviathan' },
      ]);
    });
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
