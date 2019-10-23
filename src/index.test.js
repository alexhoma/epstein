import epstein from '.';

describe('indexing', () => {
  test('should tokenize an object with only one attribute', () => {
    const docs = [{ title: 'Leviathan Awakes' }];

    const index = epstein(docs).getIndex();

    expect(index).toEqual({
      leviathan: { 0: [0] },
      awakes: { 0: [1] },
    });
  });

  test.skip('acceptance', () => {
    const docs = [
      { title: 'Leviathan Awakes', author: 'James Corey' },
      { title: 'Calibans War', author: 'James Corey' },
      { title: 'Abaddons Gate', author: 'James Corey' },
    ];

    const index = epstein(docs).getIndex();

    expect(index).toEqual({
      leviathan: { 0: [0] },
      awakes: { 0: [1] },
      calibans: { 1: [0] },
      war: { 1: [1] },
      abaddons: { 2: [0] },
      gate: { 2: [1] },
      james: { 0: [0], 1: [0], 2: [0] },
      corey: { 0: [0], 1: [0], 2: [0] },
    });
  });
});
