import axios from "axios";

const sanctumApi = axios.create({
    // baseURL: location.host,
    withCredentials: true,
});
// const sanctumApi = (axios.defaults.withCredentials = true);

export default sanctumApi;
