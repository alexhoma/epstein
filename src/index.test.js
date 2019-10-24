import epstein from '.';

describe('indexing', () => {
  test('should lowercase all tokens', () => {
    const docs = [{ title: 'LeviAThaN AwakeS' }];

    const index = epstein(docs).getIndex();

    expect(index.leviathan).toBeDefined();
    expect(index.awakes).toBeDefined();
  });

  test('should trim all tokens', () => {
    const docs = [{ title: 'leviathan     ' }];

    const index = epstein(docs).getIndex();

    expect(index['']).not.toBeDefined();
  });

  test('should remove more than one empty space between tokens', () => {
    const docs = [{ title: 'leviathan     awakes' }];

    const index = epstein(docs).getIndex();

    expect(index['']).not.toBeDefined();
  });

  test('should tokenize a simple object', () => {
    const docs = [{ title: 'Leviathan Awakes' }];

    const index = epstein(docs).getIndex();

    expect(index).toEqual({
      leviathan: { 0: [0] },
      awakes: { 0: [1] },
    });
  });

  test('should tokenize simple object with repeated tokens', () => {
    const docs = [
      { title: 'Leviathan Awakes Leviathan Awakes Awakes Leviathan' },
    ];

    const index = epstein(docs).getIndex();

    expect(index).toEqual({
      leviathan: { 0: [0, 2, 5] },
      awakes: { 0: [1, 3, 4] },
    });
  });

  test('should tokenize many simple objects', () => {
    const docs = [{ title: 'Leviathan Awakes' }, { title: 'Calibans War' }];

    const index = epstein(docs).getIndex();

    expect(index).toEqual({
      leviathan: { 0: [0] },
      awakes: { 0: [1] },
      calibans: { 1: [0] },
      war: { 1: [1] },
    });
  });

  test('should tokenize many simple objects with shared tokens', () => {
    const docs = [{ title: 'Leviathan Awakes' }, { title: 'Awakes Leviathan' }];

    const index = epstein(docs).getIndex();

    expect(index).toEqual({
      leviathan: { 0: [0], 1: [1] },
      awakes: { 0: [1], 1: [0] },
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

  test('should return a list of one matching result when searching by one exact word', () => {
    expect(index.search('gate')).toEqual([
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
