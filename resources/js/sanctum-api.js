import axios from "axios";

    const localhost = window.location.protocol + "//" + window.location.host;

const sanctumApi = axios.create({
    baseURL: localhost,
    withCredentials: true,
});
// const sanctumApi = (axios.defaults.withCredentials = true);

export default sanctumApi;
