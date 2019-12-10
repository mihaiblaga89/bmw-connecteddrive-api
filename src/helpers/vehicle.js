import BMWURLs from './urls';
import { VEHICLE_VIEWS } from '../constants';
/**
 * Vehicle class that handles all the operations for a particular vehicle
 *
 * @class Vehicle
 */
class Vehicle {
    constructor(originalData, API) {
        this.originalData = originalData;
        this.BMWURLs = new BMWURLs(API.region);
        this.API = API;
        this.images = {};
        this.status = null;
    }

    /**
     * Returns the vehicle's VIN
     *
     * @readonly
     * @returns {String}
     * @memberof Vehicle
     */
    get vin() {
        return this.originalData.vin;
    }

    /**
     * Returns the vehicle's model
     *
     * @readonly
     * @returns {String}
     * @memberof Vehicle
     */
    get model() {
        return this.originalData.model;
    }

    /**
     * Gets the status of the vehicle
     *
     * @param {Boolean} force - Force a refresh instead of getting cached data
     * @returns {Promise<VehicleStatus>}
     * @memberof Vehicle
     */
    async getStatus(force) {
        if (this.status && !force) return this.status;
        this.status = await this.API.requestWithAuth(this.BMWURLs.getVehicleStatusURL(this.vin));
        return this.status;
    }

    /**
     * Gets the vehicle's photo
     *
     * @param {number} [width=400]
     * @param {number} [height=400]
     * @param {VEHICLE_VIEWS} [view=VEHICLE_VIEWS.FRONTSIDE] - Must be one of API.VEHICLE_VIEWS.*
     * @returns {String} - the image as base64 string
     * @memberof Vehicle
     */
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

    /**
     * Returns the vehicle's name as a combination of year, brand, bodytype and model
     * Ex. 2017 BMW F30 320d
     *
     * @readonly
     * @returns {String}
     * @memberof Vehicle
     */
    get name() {
        const { yearOfConstruction, model, bodytype, brand } = this.originalData;
        return `${yearOfConstruction} ${brand} ${bodytype} ${model}`;
    }
}

export default Vehicle;
