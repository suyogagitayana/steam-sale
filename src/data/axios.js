import axios from 'axios';

const baseURL = 'https://www.cheapshark.com/api/1.0/';

const apiCall = axios.create({
    baseURL
});

export const fetchData = (params, callback = () => {}) => {
    apiCall.get('deals', {
        params: {...params}
    }).then(result => {
        if (result?.status === 200) {
            callback(result?.data);
        }
    }).catch(() => {});
};
