import getBasePath from './index';

describe.only('getBasePath', () => {
  describe('v2', () => {
    it('should throw an error', () => {
      expect(getBasePath({ swagger: '2.0.0' })).toThrow('dd');
    });
  });

  it('should return "" if there is no server', () => {})

  it('should return "/api" if the path in the first server is /api', () => {})
  
  it('should strip off any trailing slashes', () => {})
  
  it('should use the basePath in the first server', () => {})
  
  it('should return "" if there is a / at the end of the server', () => {})
})