import BMWURLs from './urls';
import API from '../index';

class Vehicle {
    constructor(originalData, region) {
        this.originalData = originalData;
        this.BMWURLs = new BMWURLs(region);
    }

    get vin() {
        return this.originalData.vin;
    }

    get model() {
        return this.originalData.model;
    }

    getStatus() {
        return API.request(this.BMWURLs.getVehicleStatusURL(this.vin));
    }
}

export default Vehicle;
