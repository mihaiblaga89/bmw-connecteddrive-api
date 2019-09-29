/* eslint-disable camelcase */
import axios from 'axios';
import querystring from 'querystring';
import moment from 'moment';

import BMWURLs from '../helpers/urls';
import Vehicle from '../helpers/vehicle';
import logger from '../helpers/logger';

class API {
    /**
     *
     * * Initialization params
     * @typedef {Object} APIInitObject
     * @property {('eu'|'us'|'cn')} region - Region where you have created the ConnectedDrive account
     * @property {string} username - The username (user@example.com)
     * @property {string} password - The password
     * @property {Boolean} [debug=false] - If you want debugging messages shown
     *
     * * Initializes the API
     *
     * @param {APIInitObject}
     * @memberof API
     */
    async init({ region, username, password, debug = false }) {
        this.region = region;
        this.username = username;
        this.password = password;
        this.vehicles = [];
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
        await this.getVehicles();
    }

    /**
     * Make a generic request to BMW API
     *
     * @param {String} url
     * @returns {Promise}
     * @memberof API
     */
    async request(url) {
        logger.log('making request', url);
        if (
            !this.oauthToken ||
            (this.tokenExpiresAt && moment().isAfter(this.tokenExpiresAt))
        ) {
            await this.getToken();
        }

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        };

        headers.accept = 'application/json';
        headers.Authorization = `Bearer ${this.oauthToken}`;

        const { data } = await axios.get(url, {
            headers,
        });

        logger.log('request response', data);

        return data;
    }

    /**
     * Gets the auth token from BMW API
     *
     * @memberof API
     */
    async getToken() {
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
            Credentials:
                'nQv6CqtxJuXWP74xf3CJwUEP:1zDHx6un4cDjybLENN3kyfumX2kEYigWPcQpdvDRpIBk7rOJ',
        };
        logger.log('token data', { postData, headers });
        const { data } = await axios.post(this.BMWURLs.getAuthURL(), postData, {
            headers,
        });

        logger.log('token response', { data });

        const { access_token, expires_in } = data;

        this.oauthToken = access_token;
        this.tokenExpiresAt = moment().add(expires_in, 'seconds');
    }

    /**
     * Gets your vehicles from BMW API and stores them
     *
     * @memberof API
     */
    async getVehicles() {
        const { data } = await this.request(this.BMWURLs.getVehiclesURL());
        if (data.vehicles) {
            this.vehicles = data.vehicles.map(
                vehicle => new Vehicle(vehicle, this)
            );
        }

        logger.log('VEHICLES', data);
    }

    get currentVehicles() {
        return this.vehicles;
    }
}

export default new API();
