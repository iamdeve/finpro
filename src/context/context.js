import React from 'react';
import { LOGIN, LOGOUT, VIEW_DATA, SET_INPUTS, SET_REVENUE, SET_USER } from './types';

export const initialState = {
	isAuthenticated: localStorage.getItem('finProtoken') ? true : false,
	user: localStorage.getItem('finProUser') ? JSON.parse(localStorage.getItem('finProUser')) : null,
	token: localStorage.getItem('finProtoken') ? localStorage.getItem('finProtoken') : null,
	data: {
		labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
		datasets: [
			{
				label: 'Silver Plan',
				data: [25, 20, 30, 22, 17, 10, 18, 26, 28, 26, 20, 32],
				backgroundColor: '#53CA35',
			},
			{
				label: 'Gold Plan',
				data: [25, 20, 30, 22, 17, 10, 18, 26, 28, 26, 20, 32],
				backgroundColor: '#F14038',
			},
			{
				label: 'Platinum Plan',
				data: [25, 20, 30, 22, 17, 10, 18, 26, 28, 26, 20, 32],
				backgroundColor: '#4E5AC0',
			},
			{
				label: 'Enter Price Plan',
				data: [25, 20, 30, 22, 17, 10, 18, 26, 28, 26, 20, 32],
				backgroundColor: '#9891AF',
			},
		],
	},

	revenues: [],
	inputs: [],
};
export const AuthContext = React.createContext();

export const reducer = (state, action) => {
	switch (action.type) {
		case LOGIN:
			localStorage.setItem('finProtoken', action.payload.token);
			localStorage.setItem('finProUser', JSON.stringify(action.payload.user));
			return {
				...state,
				isAuthenticated: true,
				user: action.payload.user,
				token: action.payload.token,
			};
		case LOGOUT:
			localStorage.removeItem('finProtoken');
			localStorage.removeItem('finProUser');
			return {
				...state,
				isAuthenticated: false,
				user: null,
				token: null,
			};
		case SET_USER:
			localStorage.setItem('finProUser', JSON.stringify(action.payload));
			return {
				...state,
				user: action.payload,
			};
		case SET_REVENUE:
			return {
				...state,
				revenues: action.payload,
			};
		case SET_INPUTS:
			return {
				...state,
				inputs: action.payload,
			};

		case VIEW_DATA:
			let updatedData = setData(action.payload.type, action.payload.flag, state);
			return {
				...state,
				data: updatedData,
			};
		default:
			return state;
	}
};

function setData(type, flag, state) {
	switch (type) {
		case 'year':
			let yearData;
			if (flag === 'revenueData') {
				let ydata = [...state[flag]];
				let ylabels = ydata.map((r) => new Date(r.date).getFullYear());
				let yprices = ydata.map((r) => r.price);
				yearData = { ...state.yearData };
				yearData.labels = ylabels;
				yearData.datasets[0] = {
					...yearData.datasets[0],
					data: [...yprices],
				};
			} else if (flag === 'salesData') {
				let ydata = [...state[flag]];
				let ylabels = ydata.map((r) => new Date(r.startDate).getFullYear());
				let ysalery = ydata.map((r) => r.salery.split(',').join(''));
				yearData = { ...state.yearData };
				yearData.labels = ylabels;
				yearData.datasets[0] = {
					...yearData.datasets[0],
					data: [...ysalery],
				};
			}
			return yearData;
		case 'quarter':
			let quarterData;
			if (flag === 'revenueData') {
				let qdata = [...state[flag]];
				let qprices = getQuarter(qdata, 'date', 'price');
				quarterData = { ...state.quarterData };
				quarterData.datasets[0] = {
					...quarterData.datasets[0],
					data: [...qprices],
				};
			} else if (flag === 'salesData') {
				let qdata = [...state[flag]];
				let qprices = getQuarter(qdata, 'startDate', 'salery');
				quarterData = { ...state.quarterData };
				quarterData.datasets[0] = {
					...quarterData.datasets[0],
					data: [...qprices],
				};
			}
			return quarterData;
		case 'month':
			let monthData;
			if (flag === 'revenueData') {
				let mdata = [...state[flag]];
				let mlabels = mdata.map((r) => getMonth(new Date(r.date).getMonth() + 1));
				let mprices = mdata.map((r) => r.price);
				monthData = { ...state.monthData };
				monthData.labels = mlabels;
				monthData.datasets[0] = {
					...monthData.datasets[0],
					data: [...mprices],
				};
			} else if (flag === 'salesData') {
				let mdata = [...state[flag]];
				let mlabels = mdata.map((r) => getMonth(new Date(r.startDate).getMonth() + 1));
				let msalery = mdata.map((r) => r.salery.split(',').join(''));
				monthData = { ...state.monthData };
				monthData.labels = mlabels;
				monthData.datasets[0] = {
					...monthData.datasets[0],
					data: [...msalery],
				};
			}
			return monthData;
		default:
			return;
	}
}

export const getMonth = (digit) => {
	switch (digit) {
		case 1:
			return 'Jan';
		case 2:
			return 'Feb';
		case 3:
			return 'Mar';
		case 4:
			return 'Apr';
		case 5:
			return 'May';
		case 6:
			return 'Jun';
		case 7:
			return 'Jul';
		case 8:
			return 'Aug';
		case 9:
			return 'Sep';
		case 10:
			return 'Oct';
		case 11:
			return 'Nov';
		case 12:
			return 'Dec';
		default:
			return;
	}
};
function getQuarter(data, date, value) {
	let Q1 = [],
		Q2 = [],
		Q3 = [],
		Q4 = [];
	data.forEach((d) => {
		if (new Date(d[date]).getMonth() === 0 || new Date(d[date]).getMonth() === 1 || new Date(d[date]).getMonth() === 2) {
			Q1.push(d.price);
		} else if (new Date(d[date]).getMonth() === 3 || new Date(d[date]).getMonth() === 4 || new Date(d[date]).getMonth() === 5) {
			Q2.push(d[value]);
		} else if (new Date(d[date]).getMonth() === 6 || new Date(d[date]).getMonth() === 7 || new Date(d[date]).getMonth() === 8) {
			Q3.push(d[value]);
		} else if (new Date(d[date]).getMonth() === 9 || new Date(d[date]).getMonth() === 10 || new Date(d[date]).getMonth() === 11) {
			Q4.push(d[value]);
		}
	});

	console.log([Q1, Q2, Q3, Q4]);
	return [Q1, Q2, Q3, Q4];
}
