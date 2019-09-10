import expect from 'expect';
import { buildTagsList, serialiseTagsList } from './tags';

describe('buildTagsList', () => {
  it('splits a string into tags', () => {
    expect(buildTagsList('one,two,three')).toEqual(['one', 'two', 'three']);
  });

  it('splits a string into tags taking care of spaces', () => {
    expect(buildTagsList('one, two, three')).toEqual(['one', 'two', 'three']);
  });

  it('splits a string into tags taking care of multiple spaces', () => {
    expect(buildTagsList('one,  two,    three')).toEqual(['one', 'two', 'three']);
  });

  it('splits a string into tags taking care of tabs', () => {
    expect(buildTagsList('one,    two,\tthree')).toEqual(['one', 'two', 'three']);
  });
});

describe('serialiseTagsList', () => {
  it('joins tags together', () => {
    expect(serialiseTagsList(['one', 'two and three', 'four'])).toBe('one, two and three, four');
  });
});
