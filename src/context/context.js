import React from 'react';
import { LOGIN, LOGOUT, SET_INPUTS, SET_REVENUE, SET_USER, VIEW_DATA } from './types';
import { getYear } from '../utils/chart-utils';
export const initialState = {
	isAuthenticated: localStorage.getItem('finProtoken') ? true : false,
	user: localStorage.getItem('finProUser') ? JSON.parse(localStorage.getItem('finProUser')) : null,
	token: localStorage.getItem('finProtoken') ? localStorage.getItem('finProtoken') : null,
	data: {
		labels: ['2021', '2022', '2023', '2024', '2025'],
		datasets: [
			{
				label: 'Silver Plan',
				data: [25, 20, 30, 22],
				backgroundColor: '#53CA35',
			},
			{
				label: 'Gold Plan',
				data: [25, 20, 30, 22],
				backgroundColor: '#F14038',
			},
			{
				label: 'Platinum Plan',
				data: [25, 20, 30, 22],
				backgroundColor: '#4E5AC0',
			},
			{
				label: 'Enterprice Plan',
				data: [25, 20, 30, 22],
				backgroundColor: '#9891AF',
			},
		],
	},

	revenues: [],
	inputs: [],
	reports: {
		labels: ['2021', '2022', '2023', '2024', '2025'],
		datasets: [
			{
				label: 'Revenue',
				data: [300, 490, 800, 1500, 1800],
				backgroundColor: '#53CA35',
			},
			{
				label: 'Expenses',
				data: [500, 900, 1200, 1100, 1200],
				backgroundColor: '#F14038',
			},
			{
				label: 'Operating Profit',
				data: [-50, -150, -200, 200, 400],
				backgroundColor: '#4E5AC0',
			},
			{
				label: 'EBIT',
				data: [-150, -300, -500, 100, 300],
				backgroundColor: '#9891AF',
			},
		],
	},
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
			let newData = setData(action.payload, state);
			return {
				...state,
				data: newData,
			};
		default:
			return state;
	}
};

function setData(type, state) {
	switch (type) {
		case 'year':
			let yearData;
			let ydata = [...state.revenues.revenuInputs];
			yearData = { ...state.data };
			let oneYearData = Object.values(getYear(ydata).total);
			let secondYeaerData = oneYearData.map((s) => s + (20 / 100) * s);
			let thirdYeaerData = secondYeaerData.map((s) => s + (20 / 100) * s);
			let fourthYearData = thirdYeaerData.map((s) => s + (20 / 100) * s);
			yearData.labels = ['2021', '2022', '2023', '2024', '2025'];
			yearData.datasets[0].data = oneYearData;
			yearData.datasets[1].data = secondYeaerData;
			yearData.datasets[2].data = thirdYeaerData;
			yearData.datasets[3].data = fourthYearData;
			console.log(yearData);
			return yearData;
		case 'quarter':
			let quarterData;
			let qdata = [...state.revenues.revenuInputs];
			quarterData = { ...state.data };
			let oneQuarterData = Object.values(getYear(qdata).total);
			let secondQuarterData = oneQuarterData.map((s) => s + (20 / 100) * s);
			let thirdQuarterData = secondQuarterData.map((s) => s + (20 / 100) * s);
			let fourthQuarterData = thirdQuarterData.map((s) => s + (20 / 100) * s);
			quarterData.labels = ['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec'];
			quarterData.datasets[0].data = oneQuarterData;
			quarterData.datasets[1].data = secondQuarterData;
			quarterData.datasets[2].data = thirdQuarterData;
			quarterData.datasets[3].data = fourthQuarterData;
			console.log(quarterData);
			return quarterData;
		case 'month':
			let monthData;
			let mdata = [...state.revenues.revenuInputs];
			monthData = { ...state.data };
			let onemonthData = Object.values(getYear(mdata).total);
			let secondmonthData = onemonthData.map((s) => s + (20 / 100) * s);
			let thirdmonthData = secondmonthData.map((s) => s + (20 / 100) * s);
			let fourthmonthData = thirdmonthData.map((s) => s + (20 / 100) * s);
			monthData.labels = ['Jan', 'Feb', 'Marc', 'Apr'];
			monthData.datasets[0].data = onemonthData;
			monthData.datasets[1].data = secondmonthData;
			monthData.datasets[2].data = thirdmonthData;
			monthData.datasets[3].data = fourthmonthData;
			console.log(monthData);
			return monthData;
		default:
			return;
	}
}
