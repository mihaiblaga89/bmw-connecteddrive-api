import BMWURLs from './urls';

class Vehicle {
    constructor(originalData, API) {
        this.originalData = originalData;
        this.BMWURLs = new BMWURLs(API.region);
        this.API = API;
    }

    get vin() {
        return this.originalData.vin;
    }

    get model() {
        return this.originalData.model;
    }

    getStatus() {
        return this.API.request(this.BMWURLs.getVehicleStatusURL(this.vin));
    }
}

export default Vehicle;
