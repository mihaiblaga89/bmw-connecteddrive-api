import axios from 'axios';

import API from '../api';
import Vehicle from '../models/vehicle';

jest.mock('axios');

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
    expect.assertions(2);

    const tokenResponse = {
        data: { access_token: 'abcd1234', expires_in: 3600 },
    };

    axios.post.mockResolvedValue(tokenResponse);

    await API.init({ region: 'eu', username: 'u', password: 'p', debug: true, skipVehicles: true })
        .then(data => expect(data).toEqual(true))
        .catch(catchFn);

    expect(catchFn).not.toHaveBeenCalled();
});

it('should get vehicles correctly', async () => {
    const catchFn = jest.fn();
    expect.assertions(2);

    axios.get.mockResolvedValue(getVehiclesResponse);
    const vehicles = await API.getVehicles().catch(catchFn);

    expect(vehicles).toEqual(getVehiclesResponse.data.vehicles.map(v => new Vehicle(v, API)));
    expect(catchFn).not.toHaveBeenCalled();
});
