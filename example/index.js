import API from '../src';

const example = async () => {
    try {
        await API.init({
            region: 'eu',
            username: 'a@gmail.com',
            password: 'b',
            debug: true,
        });

        const { currentVehicles } = API;
        console.log('currentVehicles', currentVehicles);
    } catch (e) {
        console.log('err', e);
    }
};

example();
