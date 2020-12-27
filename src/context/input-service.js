import axios from './axios';

export const addInputs = async (data) => {
	return new Promise((resolve, reject) => {
		axios
			.post('/inputs/addInputs', data)
			.then((rev) => {
				resolve(rev);
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			});
	});
};

export const deleteInputs = async (data) => {
	return new Promise((resolve, reject) => {
		axios
			.post('/inputs/deleteInputs', data)
			.then((rev) => {
				resolve(rev);
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			});
	});
};

export const updateInputs = async (data) => {
	return new Promise((resolve, reject) => {
		axios
			.put('/inputs/updateInputs', data)
			.then((rev) => {
				resolve(rev);
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			});
	});
};

export const addInputExpense = async (data) => {
	return new Promise((resolve, reject) => {
		axios
			.post('/inputs/addInputExpense', data)
			.then((rev) => {
				resolve(rev);
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			});
	});
};
export const updateInputExpense = async (data) => {
	return new Promise((resolve, reject) => {
		axios
			.put('/inputs/updateInputExpense', data)
			.then((rev) => {
				resolve(rev);
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			});
	});
};

export const deleteInputExpense = async (data) => {
	return new Promise((resolve, reject) => {
		axios
			.post('/inputs/deleteInputExpense', data)
			.then((rev) => {
				resolve(rev);
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			});
	});
};
