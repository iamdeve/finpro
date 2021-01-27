import axios from 'axios';
axios.defaults.headers.common['authorization'] = `${localStorage.getItem('finProtoken')}`;
const instance = axios.create({
	// baseURL: 'http://localhost:3000',
	baseURL: 'https://gqy6zluplk.execute-api.us-east-1.amazonaws.com',
	// baseURL: 'https://finpro-api-test.herokuapp.com/api/',
});

// export const BASE_URL = 'https://finpro-api-test.herokuapp.com/';
// export const BASE_URL = 'http://localhost:3001/';
export const BASE_URL = 'https://gqy6zluplk.execute-api.us-east-1.amazonaws.com';
export default instance;

/* test credentials
 *email
 *test@test.com
 *pass
 *$aA12345
 */
