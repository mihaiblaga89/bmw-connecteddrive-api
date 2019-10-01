import BMWURLs, { getHost } from '../helpers/urls';

const URLs = new BMWURLs('eu');

describe('Testing URLS', () => {
    it('should return baseURL', () => {
        expect(URLs.getHost()).toBe('b2vapi.bmwgroup.com');
    });
    it('should return authURL', () => {
        expect(URLs.getAuthURL()).toBe(
            'https://b2vapi.bmwgroup.com/gcdm/oauth/token'
        );
    });
    it('should return vehicleStatusURL', () => {
        expect(URLs.getVehicleStatusURL('test')).toBe(
            'https://b2vapi.bmwgroup.com/webapi/v1/user/vehicles/test/status'
        );
    });
    it('should return getRemoteServiceStatusURL', () => {
        expect(URLs.getRemoteServiceStatusURL('test', 'test')).toBe(
            'https://b2vapi.bmwgroup.com/webapi/v1/user/vehicles/test/serviceExecutionStatus?serviceType=test'
        );
    });
    it('should return getRemoteServiceURL', () => {
        expect(URLs.getRemoteServiceURL('test')).toBe(
            'https://b2vapi.bmwgroup.com/webapi/v1/user/vehicles/test/executeService'
        );
    });
    it('should return getVehicleImage', () => {
        expect(URLs.getVehicleImage('test', 100, 100, 'test')).toBe(
            'https://b2vapi.bmwgroup.com/webapi/v1/user/vehicles/test/image?width=100&height=100&view=test'
        );
    });
    it('should throw when no region', () => {
        expect(getHost).toThrowErrorMatchingSnapshot();
    });
});
