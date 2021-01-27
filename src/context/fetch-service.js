import axios from './axios';

export const getUser = async (token) => {
	return new Promise((resolve, reject) => {
		axios.defaults.headers.common['authorization'] = `${token}`;
		axios
			.get('/user')
			.then((user) => {
				resolve(user.data.user);
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			});
	});
};
export const getUserPaymentMethods = async (token) => {
	return new Promise((resolve, reject) => {
		axios
			.get('/userPayment')
			.then((payment) => {
				resolve(payment.data.paymentMethods);
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			});
	});
};

export const getUserPurchasing = async () => {
	return new Promise((resolve, reject) => {
		axios
			.get('/userPurchasing')
			.then((purchasing) => {
				resolve(purchasing.data.purchasing);
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
			.get('/userRevenue')
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
			.get('/userInputs')
			.then((input) => {
				resolve(input.data.allInputs);
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			});
	});
};
