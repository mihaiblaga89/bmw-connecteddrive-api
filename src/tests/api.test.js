import mockAxios from 'jest-mock-axios';

import API from '../api';
import Vehicle from '../helpers/vehicle';

afterEach(() => {
    mockAxios.reset();
});

const getTokenRequest = {
    data:
        'grant_type=password&scope=authenticate_user%20vehicle_data%20remote_services&username=u&password=p',
    headers: {
        Authorization:
            'Basic blF2NkNxdHhKdVhXUDc0eGYzQ0p3VUVQOjF6REh4NnVuNGNEanliTEVOTjNreWZ1bVgya0VZaWdXUGNRcGR2RFJwSUJrN3JPSg==',
        Credentials:
            'nQv6CqtxJuXWP74xf3CJwUEP:1zDHx6un4cDjybLENN3kyfumX2kEYigWPcQpdvDRpIBk7rOJ',
    },
    url: 'https://b2vapi.bmwgroup.com/gcdm/oauth/token',
};

const getVehiclesRequest = {
    data: {},
    headers: {
        Accept: 'application/json',
        Authorization: 'Bearer abcd1234',
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'GET',
    url: 'https://b2vapi.bmwgroup.com/webapi/v1/user/vehicles',
};

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
    expect.assertions(2);

    API.init({ region: 'eu', username: 'u', password: 'p', debug: true })
        .then(thenFn)
        .catch(catchFn);

    // get token
    expect(mockAxios.post).toHaveBeenCalledWith(getTokenRequest);

    // get token response
    const tokenResponse = {
        data: { access_token: 'abcd1234', expires_in: 3600 },
    };
    mockAxios.mockResponse(tokenResponse);

    // nope, you should not reach this function
    expect(catchFn).not.toHaveBeenCalled();
});

it('should get vehicles correctly', async () => {
    expect.assertions(3);

    const promise = API.getVehicles();

    mockAxios.mockResponse(getVehiclesResponse);

    const vehicles = await promise;

    expect(vehicles).toEqual(
        getVehiclesResponse.data.vehicles.map(v => new Vehicle(v, API))
    );

    expect(mockAxios.get).toHaveBeenCalledWith(getVehiclesRequest);

    expect(API.currentVehicles).toEqual(API.vehicles);
});
