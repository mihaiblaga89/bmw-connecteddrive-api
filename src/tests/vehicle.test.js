import Vehicle from '../helpers/vehicle';

const vehicle = {
    vin: 'WBAFFFFFFFF',
    model: '320d',
};

const api = { region: 'eu', request: jest.fn() };

const v = new Vehicle(vehicle, api);

it('should build correct vehicles array', () => {
    expect(v).toBeInstanceOf(Vehicle);
});

it('should return correct data', () => {
    expect(v.model).toBe(vehicle.model);
    expect(v.vin).toBe(vehicle.vin);
});

it('should get status', () => {
    v.getStatus();

    expect(api.request).toBeCalledWith(
        'https://b2vapi.bmwgroup.com/webapi/v1/user/vehicles/WBAFFFFFFFF/status'
    );
});
