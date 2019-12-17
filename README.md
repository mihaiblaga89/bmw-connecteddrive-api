# bmw-connecteddrive-api

[![codecov](https://codecov.io/gh/mihaiblaga89/bmw-connecteddrive-api/branch/master/graph/badge.svg)](https://codecov.io/gh/mihaiblaga89/bmw-connecteddrive-api)
[![Actions Status](https://github.com/mihaiblaga89/bmw-connecteddrive-api/workflows/tests/badge.svg)](https://github.com/mihaiblaga89/bmw-connecteddrive-api/actions)
[![CodeFactor](https://www.codefactor.io/repository/github/mihaiblaga89/bmw-connecteddrive-api/badge/master)](https://www.codefactor.io/repository/github/mihaiblaga89/bmw-connecteddrive-api/overview/master)

JavaScript implementation of the BMW's ConnectedDrive API

Example: [BMWStatus](https://github.com/mihaiblaga89/bmw-status-app)

## Usage

```javascript
import API from '@mihaiblaga89/bmw-connecteddrive-api';

await API.init({
    region: 'eu',
    username: 'user@example.com',
    password: 'mySuperPassword',
});

const vehicles = await API.getVehicles();

const vehicleStatus = await vehicles[0].getStatus();
```

## API Methods

#### API.init(options)

Initializes the API with your credentials. By default it also fetches your vehicles and saves them but you can disable this behaviour if you want. [More info](https://bmwapi.mihaiblaga.dev/?api#API#init)

#### API.getVehicles(force)

Returns your prefetched vehicles or queries the BMW API for them. Has the option to force the query to refresh your vehicles. Every vehicle is an instance of [Vehicle](https://bmwapi.mihaiblaga.dev/?api#Vehicle). [More info](https://bmwapi.mihaiblaga.dev/?api#API#getVehicles)

## Vehicle Methods

#### Vehicle.getImage(width, height, view)

Fetches and caches your vehicle image from BMW API. Of course it's not the actual photo, it's just a car photo based on your car's model and color :). Several "views" are available. [More info](https://bmwapi.mihaiblaga.dev/?api#Vehicle#getImage)

#### Vehicle.getStatus(force)

Fetches and caches the car's status from the API. Can be forced. Returns an instance of [VehicleStatus](https://bmwapi.mihaiblaga.dev/?api#VehicleStatus). [More info](https://bmwapi.mihaiblaga.dev/?api#Vehicle#getStatus)
