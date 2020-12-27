import jwtDecode from 'jwt-decode';
export function logout() {
	localStorage.removeItem('finProtoken');
}
export function getCurrentUser() {
	try {
		const jwt = localStorage.getItem('finProtoken');
		return jwtDecode(jwt);
	} catch (e) {
		return null;
	}
}

export function loginWithJWT(jwt) {
	localStorage.setItem('finProtoken', jwt);
}
export function getJWT() {
	return localStorage.getItem('finProtoken');
}
export function getHeader() {
	return {
		headers: {
			authorization: getJWT(),
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
