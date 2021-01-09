import axios from './axios';

export const subscription = async (startTrial) => {
	return new Promise((resolve, reject) => {
		axios
			.post('/subscription', { startTrial })
			.then((rev) => {
				resolve(rev);
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			});
	});
};
export const cancelSubscription = async () => {
	return new Promise((resolve, reject) => {
		axios
			.post('/cancel')
			.then((rev) => {
				resolve(rev);
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			});
	});
};

export const userInvoices = async () => {
	return new Promise((resolve, reject) => {
		axios
			.get('/invoices')
			.then((rev) => {
				resolve(rev.data.userInvoices);
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			});
	});
};
