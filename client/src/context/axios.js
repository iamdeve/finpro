import axios from 'axios';
axios.defaults.headers.common['authorization'] = `${localStorage.getItem('token')}`;
const instance = axios.create({
	baseURL: 'http://localhost:3001/api/',
});
export default instance;
