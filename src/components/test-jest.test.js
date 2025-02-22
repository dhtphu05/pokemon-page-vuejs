import { test, expect } from '@jest/globals';
import { addTwoNumbers } from './test-jest.js';

test('adds 1 + 2 to equal 3', () => {
  expect(addTwoNumbers(1, 2)).toBe(3);
});

