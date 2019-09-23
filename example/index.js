import API from '../src';

const example = async () => {
    try {
        await API.init({
            region: 'eu',
            username: 'user',
            password: 'pass',
        });

        const { currentVehicles } = API;
        const { data } = await currentVehicles[0].getStatus();
        console.log('status', data);
    } catch (e) {
        console.log('err', e);
    }
};

example();
