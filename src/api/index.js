/* eslint-disable camelcase */
import axios from 'axios';
import querystring from 'querystring';
import moment from 'moment';
import axiosRetry from 'axios-retry';

import BMWURLs from '../models/urls';
import Vehicle from '../models/vehicle';
import logger from '../models/logger';
import { VEHICLE_VIEWS } from '../constants';

axiosRetry(axios, { retries: 3 });
const sleep = (ms = 0) => new Promise(r => setTimeout(r, ms));

/**
 * API Class
 *
 * @class API
 * @property {Object} [VEHICLE_VIEWS] - Views available for vehicle images
 * @property {String} [VEHICLE_VIEWS.FRONTSIDE] -
 * @property {String} [VEHICLE_VIEWS.FRONT] -
 * @property {String} [VEHICLE_VIEWS.REARSIDE] -
 * @property {String} [VEHICLE_VIEWS.REAR] -
 * @property {String} [VEHICLE_VIEWS.SIDE] -
 * @property {String} [VEHICLE_VIEWS.DASHBOARD] -
 * @property {String} [VEHICLE_VIEWS.DRIVERDOOR] -
 * @property {String} [VEHICLE_VIEWS.REARBIRDSEYE] -
 */
class API {
    constructor() {
        this.initialized = false;
    }

    /**
     * Initializes the API
     *
     * @param {Object} params
     * @param {('eu'|'us'|'cn')} params.region Region where you have created the ConnectedDrive account
     * @param {String} params.username The ConnectedDrive username (user@example.com)
     * @param {String} params.password The ConnectedDrive password
     * @param {Boolean} [params.debug=false] If you want debugging messages printed to the console
     * @param {Boolean} [params.skipVehicles=false] If you want to skip the initial request of vehicles and do it manually with API.getVehicles()
     * @returns {Promise<Boolean>}
     * @memberof API
     *
     * @example
     * import API from '@mihaiblaga89/bmw-connecteddrive-api';
     *
     * await API.init({
     *   region: 'eu',
     *   username: 'user@example.com',
     *   password: 'mySuperPassword',
     *   debug: true,
     * });
     */
    async init({ region, username, password, debug = false, skipVehicles = false }) {
        if (!region || !username || !password) {
            throw new Error('You must specify all the required parameters (region, username, password)');
        }
        this.initialized = true;
        this.region = region;
        this.username = username;
        this.password = password;
        this.vehicles = null;
        this.BMWURLs = new BMWURLs(region);
        this.oauthToken = null;
        this.refreshToken = null;
        this.tokenExpiresAt = null;

        logger.init(debug);
        logger.log('initialized API with', {
            region,
            username,
            password,
            debug,
        });
        // eslint-disable-next-line no-unused-expressions
        if (!skipVehicles) {
            await this.getVehicles();
        }
        return true;
    }

    /**
     * Make a generic request to BMW API
     *
     * @private
     * @param {String} url
     * @returns {Promise<Response>}
     * @memberof API
     */
    async requestWithAuth(url, { overwriteHeaders = {}, method = 'GET', postData = {}, ...rest } = {}) {
        if (!this.initialized) throw new Error('You called a function before init()');
        logger.log('making request', url);
        if (!this.oauthToken || (this.tokenExpiresAt && moment().isAfter(this.tokenExpiresAt))) {
            await this.getToken();
            await sleep(200); // if the request is made too quickly the API will reject it with 500
        }
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
            Authorization: `Bearer ${this.oauthToken}`,
            ...overwriteHeaders,
        };
        // separated for easy testing
        let response;
        if (method === 'GET') {
            response = await axios.get(url, { headers, ...rest });
        } else {
            response = await axios.post(url, postData, { headers, ...rest });
        }

        const { data } = response;
        logger.log('request response', data);
        return data;
    }

    /**
     * Gets the auth token from BMW API
     * @private
     * @returns {Promise}
     * @memberof API
     */
    async getToken() {
        if (!this.initialized) throw new Error('You called a function before init()');
        logger.log('getting token');
        const { username, password } = this;
        const postData = querystring.stringify({
            grant_type: 'password',
            scope: 'authenticate_user vehicle_data remote_services',
            username,
            password,
        });

        const headers = {
            Authorization:
                'Basic blF2NkNxdHhKdVhXUDc0eGYzQ0p3VUVQOjF6REh4NnVuNGNEanliTEVOTjNreWZ1bVgya0VZaWdXUGNRcGR2RFJwSUJrN3JPSg==',
            Credentials: 'nQv6CqtxJuXWP74xf3CJwUEP:1zDHx6un4cDjybLENN3kyfumX2kEYigWPcQpdvDRpIBk7rOJ',
        };
        logger.log('token data', { postData, headers });
        const { data } = await axios.post(this.BMWURLs.getAuthURL(), postData, {
            headers,
        });

        logger.log('token response', { data });

        const { access_token, expires_in, refresh_token } = data;

        this.oauthToken = access_token;
        this.refreshToken = refresh_token;
        this.tokenExpiresAt = moment().add(expires_in, 'seconds');
    }

    /**
     * Gets your currently stored vehicles or fetches them from the BMW's API
     *
     * @memberof API
     * @param {Boolean} [force=false] Force a refresh from ConnectedDrive API
     * @returns {Array<Vehicle>}
     *
     * @example
     * const vehicles = await API.getVehicles();
     */
    async getVehicles(force = false) {
        if (!this.initialized) throw new Error('You called a function before init()');
        if (this.vehicles && !force) return this.vehicles;

        const { vehicles } = await this.requestWithAuth(this.BMWURLs.getVehiclesURL());

        if (vehicles) {
            this.vehicles = vehicles.map(vehicle => new Vehicle(vehicle, this));
        }

        return this.vehicles;
    }
}

// adding constants
const exported = new API();

exported.VEHICLE_VIEWS = VEHICLE_VIEWS;

export default exported;
