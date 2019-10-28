import { filterEmptySpaces, filterStopWords, tokenize } from './analyzers';

describe('filterEmptySpaces', () => {
  test('should trim the value', () => {
    const value = '   leviathan awakes   ';

    expect(filterEmptySpaces(value)).toEqual('leviathan awakes');
  });

  test('should remove more than one empty space between words', () => {
    const value = 'leviathan     awakes';

    expect(filterEmptySpaces(value)).toEqual('leviathan awakes');
  });
});

describe('filterStopWords', () => {
  test('should filter stopwords (case inensitive)', () => {
    const value = 'The leviathan is awake';

    expect(filterStopWords(value)).toEqual('leviathan awake');
  });
});

describe('tokenize', () => {
  test('should split the value by empty spaces', () => {
    const value = 'the leviathan awakes';

    expect(tokenize(value)).toEqual(['the', 'leviathan', 'awakes']);
  });

  test('should lowercase all tokens', () => {
    const value = 'The LeviAThaN AwakeS';

    expect(tokenize(value)).toEqual(['the', 'leviathan', 'awakes']);
  });
});
