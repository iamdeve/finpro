import axios from 'axios';
axios.defaults.headers.common['authorization'] = `${localStorage.getItem('finProtoken')}`;
const instance = axios.create({
	//baseURL: 'http://localhost:3001/api/',
	baseURL: 'https://finpro-api-test.herokuapp.com/api/',
});

export const BASE_URL = 'https://finpro-api-test.herokuapp.com/';
//export const BASE_URL = 'http://localhost:3001/'
export default instance;
