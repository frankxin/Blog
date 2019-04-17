import axios from 'axios';
import { AxiosInstance } from 'axios';
import _ from 'lodash';

const http = axios.create({
    withCredentials: true
});

export default http;
