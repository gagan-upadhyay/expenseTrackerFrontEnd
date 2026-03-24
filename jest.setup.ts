import fetchMock from 'jest-fetch-mock';
import '@testing-library/jest-dom';

fetchMock.enableMocks();

declare global {
  
  var fetchA: typeof fetch;
}
