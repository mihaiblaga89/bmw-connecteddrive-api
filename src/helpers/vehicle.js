import BMWURLs from './urls';
import { VEHICLE_VIEWS } from '../constants';

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
        return this.API.requestWithAuth(
            this.BMWURLs.getVehicleStatusURL(this.vin)
        );
    }

    getImage(width = 400, height = 400, view = VEHICLE_VIEWS.FRONTSIDE) {
        return this.API.requestWithAuth(
            this.BMWURLs.getVehicleImage(this.vin, width, height, view),
            { overwriteHeaders: { Accept: 'image/png' } }
        );
    }
}

export default Vehicle;
