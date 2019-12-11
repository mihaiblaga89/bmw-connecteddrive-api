/* eslint-disable no-console */
import API from '../src';

const example = async () => {
    try {
        await API.init({
            region: 'eu',
            username: 'a@gmail.com',
            password: 'b',
            debug: true,
        });

        const currentVehicles = await API.getVehicles();
        console.log('currentVehicles', currentVehicles);
        const image = await currentVehicles[0].getImage();
        console.log('img', image);
    } catch (e) {
        console.log('err', e);
    }
};

example();
