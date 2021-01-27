import axios from './axios';

export const addPayment = async (data) => {
	return new Promise((resolve, reject) => {
		axios
			.post('/add', data)
			.then((rev) => {
				resolve(rev);
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			});
	});
};

export const deletePayment = async (id) => {
	return new Promise((resolve, reject) => {
		axios
			.delete('/delete/' + id)
			.then((rev) => {
				resolve(rev);
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			});
	});
};
