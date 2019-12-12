import BMWURLs from './urls';
import { VEHICLE_VIEWS } from '../constants';
import VehicleStatus from './vehicleStatus';

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
     *
     * @example
     * const { vin } = Vehicle
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
     *
     * @example
     * const { model } = Vehicle
     */
    get model() {
        return this.originalData.model;
    }

    /**
     * Gets the status of the vehicle
     *
     * @param {Boolean} [force=false] - Force a refresh instead of getting cached data
     * @returns {Promise<VehicleStatus>}
     * @memberof Vehicle
     *
     * @example
     * const ctatus = await Vehicle.getStatus();
     */
    async getStatus(force) {
        if (this.status && !force) return this.status;
        const { vehicleStatus } = await this.API.requestWithAuth(this.BMWURLs.getVehicleStatusURL(this.vin));
        this.status = VehicleStatus(vehicleStatus);
        return this.status;
    }

    /**
     * Gets the vehicle's photo
     *
     * @param {number} [width=400] Image's width
     * @param {number} [height=400] Image's height
     * @param {String} [view=VEHICLE_VIEWS.FRONTSIDE] - Must be one of {@link API|API.VEHICLE_VIEWS}.*
     * @returns {String} - the image as base64 string
     * @memberof Vehicle
     *
     * @example
     * const image = await Vehicle.getImage(400, 400, API.VEHICLE_VIEWS.FRONTSIDE);
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
