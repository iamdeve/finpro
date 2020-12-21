import jwtDecode from 'jwt-decode';
export function logout() {
	sessionStorage.removeItem('token');
}
export function getCurrentUser() {
	try {
		const jwt = sessionStorage.getItem('token');
		return jwtDecode(jwt);
	} catch (e) {
		return null;
	}
}

export function loginWithJWT(jwt) {
	sessionStorage.setItem('token', jwt);
}
export function getJWT() {
	return sessionStorage.getItem('token');
}
export function getHeader() {
	return {
		headers: {
			Authorization: 'Bearer '.concat(getJWT()),
		},
	};
}
export const AuthService = {
	getCurrentUser,
	logout,
	loginWithJWT,
	getJWT,
	getHeader,
};
