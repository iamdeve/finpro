import React from 'react';
import { LOGIN, LOGOUT, SET_INPUTS, SET_REVENUE, SET_USER, SET_BILLING, SET_INVOICES, SET_PURCHASING, VIEW_DATA } from './types';
import { getMonthName } from '../utils/utils';
export const initialState = {
	isAuthenticated: localStorage.getItem('finProtoken') ? true : false,
	user: localStorage.getItem('finProUser') ? JSON.parse(localStorage.getItem('finProUser')) : null,
	token: localStorage.getItem('finProtoken') ? localStorage.getItem('finProtoken') : null,
	billingDetails: {},
	data: {},
	invoices: [],
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
		case SET_BILLING:
			return {
				...state,
				billingDetails: action.payload,
			};
		case VIEW_DATA:
			let newData = setData(action.payload, state);
			return {
				...state,
				data: newData,
			};
		case SET_PURCHASING:
			return {
				...state,
				purchasing: action.payload,
			};
		case SET_INVOICES:
			return {
				...state,
				invoices: action.payload,
			};
		default:
			return state;
	}
};

function setData(type, state) {
	switch (type) {
		case 'year':
			let yearData;
			let ydata = [...state.revenues.revenuInputs].filter((t) => t.type === 'Yearly');
			yearData = {
				labels: [],
				datasets: [],
			};
			let datalabels = ydata.map((l) => l.plan);
			let datasets = [];
			for (let i = 0; i <= 4; i++) {
				let a1 = [],
					a2 = [],
					a3 = [],
					a4 = [],
					a5 = [];
				ydata.forEach((d, id) => {
					if (id === 0) {
						a1.push(parseFloat(d.price));
						for (let j = 0; j < 4; j++) {
							a1.push(parseFloat(a1[j]) + (20 / 100) * parseFloat(a1[j]));
						}
					} else if (id === 1) {
						a2.push(parseFloat(d.price));
						for (let j = 0; j < 4; j++) {
							a2.push(parseFloat(a2[j]) + (20 / 100) * parseFloat(a2[j]));
						}
					} else if (id === 2) {
						a3.push(parseFloat(d.price));
						for (let j = 0; j < 4; j++) {
							a3.push(parseFloat(a3[j]) + (20 / 100) * parseFloat(a3[j]));
						}
					} else if (id === 3) {
						a4.push(parseFloat(d.price));
						for (let j = 0; j < 4; j++) {
							a4.push(parseFloat(a4[j]) + (20 / 100) * parseFloat(a4[j]));
						}
					}
				});

				if (a1.length >= 4) {
					datasets.push(a1);
				}
				if (a2.length >= 4) {
					datasets.push(a2);
				}
				if (a3.length >= 4) {
					datasets.push(a3);
				}
				if (a4.length >= 4) {
					datasets.push(a4);
				}
				if (a5.length >= 4) {
					datasets.push(a5);
				}
			}
			yearData.labels = [new Date().getFullYear() + 1, new Date().getFullYear() + 2, new Date().getFullYear() + 3, new Date().getFullYear() + 4, new Date().getFullYear() + 5];
			datalabels.forEach((label, id) => {
				yearData.datasets[id] = {};
				if (label === 'Silver Plan') {
					yearData.datasets[id].backgroundColor = '#53CA35';
				} else if (label === 'Gold Plan') {
					yearData.datasets[id].backgroundColor = '#F14038';
				} else if (label === 'Platinum Plan') {
					yearData.datasets[id].backgroundColor = '#4E5AC0';
				} else if (label === 'Enterprice Plan') {
					yearData.datasets[id].backgroundColor = '#9891AF';
				}
				yearData.datasets[id].data = datasets[id];
				yearData.datasets[id].label = label;
			});
			return yearData;
		case 'quarter':
			let quarterData;
			let qdata = [...state.revenues.revenuInputs].filter((t) => t.type === 'Quarter');
			quarterData = { labels: [], datasets: [] };

			let qdatalabels = qdata.map((l) => l.plan);
			let qdatasets = [];
			for (let i = 0; i <= 4; i++) {
				let a1 = [],
					a2 = [],
					a3 = [],
					a4 = [],
					a5 = [];
				qdata.forEach((d, id) => {
					if (id === 0) {
						a1.push(parseFloat(d.price));
						for (let j = 0; j < 4; j++) {
							a1.push(parseFloat(a1[j]) + (20 / 100) * parseFloat(a1[j]));
						}
					} else if (id === 1) {
						a2.push(parseFloat(d.price));
						for (let j = 0; j < 4; j++) {
							a2.push(parseFloat(a2[j]) + (20 / 100) * parseFloat(a2[j]));
						}
					} else if (id === 2) {
						a3.push(parseFloat(d.price));
						for (let j = 0; j < 4; j++) {
							a3.push(parseFloat(a3[j]) + (20 / 100) * parseFloat(a3[j]));
						}
					} else if (id === 3) {
						a4.push(parseFloat(d.price));
						for (let j = 0; j < 4; j++) {
							a4.push(parseFloat(a4[j]) + (20 / 100) * parseFloat(a4[j]));
						}
					}
				});

				if (a1.length >= 4) {
					qdatasets.push(a1);
				}
				if (a2.length >= 4) {
					qdatasets.push(a2);
				}
				if (a3.length >= 4) {
					qdatasets.push(a3);
				}
				if (a4.length >= 4) {
					qdatasets.push(a4);
				}
				if (a5.length >= 4) {
					qdatasets.push(a5);
				}
			}
			quarterData.labels = ['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec'];

			qdatalabels.forEach((label, id) => {
				quarterData.datasets[id] = {};
				if (label === 'Silver Plan') {
					quarterData.datasets[id].backgroundColor = '#53CA35';
				} else if (label === 'Gold Plan') {
					quarterData.datasets[id].backgroundColor = '#F14038';
				} else if (label === 'Platinum Plan') {
					quarterData.datasets[id].backgroundColor = '#4E5AC0';
				} else if (label === 'Enterprice Plan') {
					quarterData.datasets[id].backgroundColor = '#9891AF';
				}
				quarterData.datasets[id].data = qdatasets[id];
				quarterData.datasets[id].label = label;
			});
			return quarterData;
		case 'month':
			let monthData;
			let mdata = [...state.revenues.revenuInputs].filter((t) => t.type === 'Monthly');
			monthData = { labels: [], datasets: [] };

			let mdatalabels = mdata.map((l) => l.plan);
			let mdatasets = [];
			for (let i = 0; i <= 4; i++) {
				let a1 = [],
					a2 = [],
					a3 = [],
					a4 = [],
					a5 = [];
				mdata.forEach((d, id) => {
					if (id === 0) {
						a1.push(parseFloat(d.price));
						for (let j = 0; j < 4; j++) {
							a1.push(parseFloat(a1[j]) + (20 / 100) * parseFloat(a1[j]));
						}
					} else if (id === 1) {
						a2.push(parseFloat(d.price));
						for (let j = 0; j < 4; j++) {
							a2.push(parseFloat(a2[j]) + (20 / 100) * parseFloat(a2[j]));
						}
					} else if (id === 2) {
						a3.push(parseFloat(d.price));
						for (let j = 0; j < 4; j++) {
							a3.push(parseFloat(a3[j]) + (20 / 100) * parseFloat(a3[j]));
						}
					} else if (id === 3) {
						a4.push(parseFloat(d.price));
						for (let j = 0; j < 4; j++) {
							a4.push(parseFloat(a4[j]) + (20 / 100) * parseFloat(a4[j]));
						}
					}
				});

				if (a1.length >= 4) {
					mdatasets.push(a1);
				}
				if (a2.length >= 4) {
					mdatasets.push(a2);
				}
				if (a3.length >= 4) {
					mdatasets.push(a3);
				}
				if (a4.length >= 4) {
					mdatasets.push(a4);
				}
				if (a5.length >= 4) {
					mdatasets.push(a5);
				}
			}
			monthData.labels = [getMonthName(new Date().getMonth() + 1), getMonthName(new Date().getMonth() + 2 - 12), getMonthName(new Date().getMonth() + 3 - 12), getMonthName(new Date().getMonth() + 4 - 12), getMonthName(new Date().getMonth() + 5 - 12)];

			mdatalabels.forEach((label, id) => {
				monthData.datasets[id] = {};
				if (label === 'Silver Plan') {
					monthData.datasets[id].backgroundColor = '#53CA35';
				} else if (label === 'Gold Plan') {
					monthData.datasets[id].backgroundColor = '#F14038';
				} else if (label === 'Platinum Plan') {
					monthData.datasets[id].backgroundColor = '#4E5AC0';
				} else if (label === 'Enterprice Plan') {
					monthData.datasets[id].backgroundColor = '#9891AF';
				}
				monthData.datasets[id].data = mdatasets[id];
				monthData.datasets[id].label = label;
			});
			return monthData;
		default:
			return;
	}
}
