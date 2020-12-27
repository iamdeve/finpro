import axios from './axios';

export const getUser = async (token) => {
	return new Promise((resolve, reject) => {
		axios.defaults.headers.common['authorization'] = `${token}`;
		axios
			.get('/auth/user')
			.then((user) => {
				resolve(user.data.user);
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			});
	});
};

export const getRevenue = async () => {
	return new Promise((resolve, reject) => {
		axios
			.get('/revenue/userRevenue')
			.then((reve) => {
				resolve(reve.data.allRevenus);
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			});
	});
};

export const getInputs = async () => {
	return new Promise((resolve, reject) => {
		axios
			.get('/inputs/userInputs')
			.then((input) => {
				resolve(input.data.allInputs);
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			});
	});
};
