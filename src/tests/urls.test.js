import BMWURLs from '../helpers/urls';

const URLs = new BMWURLs('eu');

describe('Testing URLS', () => {
  it('should return baseURL', () => {
    expect(URLs.getHost()).toBe('b2vapi.bmwgroup.com');
  });
});
