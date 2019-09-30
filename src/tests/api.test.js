import mockAxios from 'jest-mock-axios';

import API from '../api';
import Vehicle from '../helpers/vehicle';

afterEach(() => {
    mockAxios.reset();
});

const getTokenRequest = [
    'https://b2vapi.bmwgroup.com/gcdm/oauth/token',
    'grant_type=password&scope=authenticate_user%20vehicle_data%20remote_services&username=u&password=p',
    {
        headers: {
            Authorization:
                'Basic blF2NkNxdHhKdVhXUDc0eGYzQ0p3VUVQOjF6REh4NnVuNGNEanliTEVOTjNreWZ1bVgya0VZaWdXUGNRcGR2RFJwSUJrN3JPSg==',
            Credentials:
                'nQv6CqtxJuXWP74xf3CJwUEP:1zDHx6un4cDjybLENN3kyfumX2kEYigWPcQpdvDRpIBk7rOJ',
        },
    },
];

const getVehiclesRequest = [
    'https://b2vapi.bmwgroup.com/webapi/v1/user/vehicles',
    {
        headers: {
            Authorization: 'Bearer abcd1234',
            'Content-Type': 'application/x-www-form-urlencoded',
            accept: 'application/json',
        },
    },
];

const getVehiclesResponse = {
    data: {
        vehicles: [
            {
                vin: 'WBAFFFFFFFF',
                model: '320d',
            },
            {
                vin: 'WBAFFFFFFFA',
                model: '520i',
            },
        ],
    },
};

it('should initialize correctly', async () => {
    const catchFn = jest.fn();
    const thenFn = jest.fn();
    expect.assertions();

    API.init({ region: 'eu', username: 'u', password: 'p' })
        .then(thenFn)
        .catch(catchFn);

    // get token
    expect(mockAxios.post).toHaveBeenCalledWith(...getTokenRequest);

    // get token response
    const tokenResponse = {
        data: { access_token: 'abcd1234', expires_in: 3600 },
    };
    mockAxios.mockResponse(tokenResponse);

    // nope, you should not reach this function
    expect(catchFn).not.toHaveBeenCalled();
});

it('should get token correctly', () => {
    const catchFn = jest.fn();
    const thenFn = jest.fn();

    API.getToken()
        .then(thenFn)
        .catch(catchFn);

    // get token
    expect(mockAxios.post).toHaveBeenCalledWith(...getTokenRequest);

    // get token response
    const tokenResponse = {
        data: { access_token: 'abcd1234', expires_in: 3600 },
    };
    mockAxios.mockResponse(tokenResponse);

    // nope, you should not reach this function
    expect(catchFn).not.toHaveBeenCalled();
});

it('should get vehicles correctly', () => {
    const catchFn = jest.fn();
    const thenFn = jest.fn();

    API.getVehicles()
        .then(thenFn)
        .catch(catchFn);

    // get vehicles
    expect(mockAxios.get).toHaveBeenCalledWith(...getVehiclesRequest);

    // get vehicles response
    mockAxios.mockResponse(getVehiclesResponse);

    // nope, you should not reach this function
    expect(catchFn).not.toHaveBeenCalled();
});

afterAll(() => {
    mockAxios.reset();
    expect(API.vehicles).toEqual(
        getVehiclesResponse.data.vehicles.map(v => new Vehicle(v, API))
    );
    expect(API.currentVehicles).toEqual(API.vehicles);
});
