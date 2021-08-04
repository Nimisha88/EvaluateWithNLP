/**
 * @jest-environment jsdom
 */

const createResultContainer = require('../components/result-components.js').default;

test('Check if Result Container is getting created', () => {
  expect(createResultContainer().classList.contains('result-container')).toBe(true);
  expect(createResultContainer().tagName).toBe('DIV');
});
