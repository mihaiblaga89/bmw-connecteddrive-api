import BMWURLs from './urls';
import { VEHICLE_VIEWS } from '../constants';

class Vehicle {
    constructor(originalData, API) {
        this.originalData = originalData;
        this.BMWURLs = new BMWURLs(API.region);
        this.API = API;
        this.images = {};
    }

    get vin() {
        return this.originalData.vin;
    }

    get model() {
        return this.originalData.model;
    }

    getStatus() {
        return this.API.requestWithAuth(this.BMWURLs.getVehicleStatusURL(this.vin));
    }

    async getImage(width = 400, height = 400, view = VEHICLE_VIEWS.FRONTSIDE) {
        if (this.images[`${view}:${width}:${height}`]) {
            return this.images[`${view}:${width}:${height}`];
        }
        const binaryImage = await this.API.requestWithAuth(
            this.BMWURLs.getVehicleImage(this.vin, width, height, view),
            { overwriteHeaders: { Accept: 'image/png' }, responseType: 'arraybuffer' }
        );

        this.images[`${view}:${width}:${height}`] = `data:image/png;base64,${Buffer.from(
            binaryImage,
            'binary'
        ).toString('base64')}`;
        return this.images[`${view}:${width}:${height}`];
    }

    get name() {
        const { yearOfConstruction, model, bodytype, brand } = this.originalData;
        return `${yearOfConstruction} ${brand} ${bodytype} ${model}`; // 2017 BMW F30 320d
    }
}

export default Vehicle;
