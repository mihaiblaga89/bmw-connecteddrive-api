/* eslint-disable camelcase */
import axios from 'axios';
import querystring from 'querystring';
import moment from 'moment';

import BMWURLs from '../helpers/urls';
import Vehicle from '../helpers/vehicle';
import logger from '../helpers/logger';

class API {
    async init({ region, username, password, debug = false }) {
        this.region = region;
        this.username = username;
        this.password = password;
        this.vehicles = [];
        this.BMWURLs = new BMWURLs(region);
        this.oauthToken = null;
        this.refreshToken = null;
        this.tokenExpiresAt = null;

        logger.initialize(debug);
        await this.getVehicles();
    }

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
            'User-Agent':
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.75 Safari/537.36',
        };

        headers.accept = 'application/json';
        headers.Authorization = `Bearer ${this.oauthToken}`;
        headers.referer = 'https://www.bmw-connecteddrive.de/app/index.html';

        const { data } = await axios.get(url, {
            headers,
        });

        logger.log('request response', data);

        return data;
    }

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
            'Content-Length': '124',
            Connection: 'Keep-Alive',
            Host: this.BMWURLs.getHost(),
            'Accept-Encoding': 'gzip',
            Authorization:
                'Basic blF2NkNxdHhKdVhXUDc0eGYzQ0p3VUVQOjF6REh4NnVuNGNEanliTEVOTjNreWZ1bVgya0VZaWdXUGNRcGR2RFJwSUJrN3JPSg==',
            Credentials:
                'nQv6CqtxJuXWP74xf3CJwUEP:1zDHx6un4cDjybLENN3kyfumX2kEYigWPcQpdvDRpIBk7rOJ',
            'User-Agent': 'okhttp/2.60',
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

    async getVehicles() {
        const { data } = await this.request(this.BMWURLs.getVehiclesURL());
        if (data.vehicles) {
            this.vehicles = data.vehicles.map(
                vehicle => new Vehicle(vehicle, this.region)
            );
        }

        logger.log('VEHICLES', data);
    }

    get currentVehicles() {
        return this.vehicles;
    }
}

export default new API();
