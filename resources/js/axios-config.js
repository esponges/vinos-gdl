import axios from 'axios';

const localhost = window.location.protocol + "//" + window.location.host;

const axiosAuth = axios.create({
    baseURL: localhost,
});

export default axiosAuth;
