import axios from 'axios';
axios.defaults.headers.common['authorization'] = `${localStorage.getItem('token')}`;
const instance = axios.create({
	baseURL: 'http://localhost:3001/api/',
	// baseURL: 'https://finpro-api-test.herokuapp.com/api/',
});
export default instance;
