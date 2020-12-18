import React from 'react';

export const initialState = {
	isAuthenticated: localStorage.getItem('user') ? true : true,
	user: null,
	token: null,
};
export const AuthContext = React.createContext();

export const reducer = (state, action) => {
	switch (action.type) {
		case 'LOGIN':
			localStorage.setItem('user', JSON.stringify(action.payload.user));
			localStorage.setItem('token', JSON.stringify(action.payload.token));
			return {
				...state,
				isAuthenticated: true,
				user: action.payload.user,
				token: action.payload.token,
			};
		case 'LOGOUT':
			localStorage.clear();
			return {
				...state,
				isAuthenticated: false,
				user: null,
			};
		default:
			return state;
	}
};
