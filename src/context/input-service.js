import axios from './axios';

export const addInputs = async (data) => {
	return new Promise((resolve, reject) => {
		axios
			.post('/addInputs', data)
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
			.post('/deleteInputs', data)
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
			.put('/updateInputs', data)
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
			.post('/addInputExpense', data)
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
			.put('/updateInputExpense', data)
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
			.post('/deleteInputExpense', data)
			.then((rev) => {
				resolve(rev);
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			});
	});
};
