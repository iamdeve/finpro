import axios from './axios';

export const addPlan = async (data) => {
	return new Promise((resolve, reject) => {
		axios
			.post('/addRevenue', data)
			.then((rev) => {
				resolve(rev);
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			});
	});
};

export const deletePlan = async (data) => {
	return new Promise((resolve, reject) => {
		axios
			.post('/deleteRevenue', data)
			.then((rev) => {
				resolve(rev);
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			});
	});
};

export const updatePlan = async (data) => {
	return new Promise((resolve, reject) => {
		axios
			.put('/updateRevenue', data)
			.then((rev) => {
				resolve(rev);
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			});
	});
};

export const addExpense = async (data) => {
	return new Promise((resolve, reject) => {
		axios
			.post('/addExpense', data)
			.then((rev) => {
				resolve(rev);
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			});
	});
};
export const updateExpense = async (data) => {
	return new Promise((resolve, reject) => {
		axios
			.put('/updateExpense', data)
			.then((rev) => {
				resolve(rev);
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			});
	});
};

export const deleteExpense = async (data) => {
	return new Promise((resolve, reject) => {
		axios
			.post('/deleteExpense', data)
			.then((rev) => {
				resolve(rev);
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			});
	});
};

export const addStartingCapital = async (data) => {
	return new Promise((resolve, reject) => {
		axios
			.post('/addStartingCapital', data)
			.then((rev) => {
				resolve(rev);
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			});
	});
};
export const updateStartingCapital = async (data) => {
	return new Promise((resolve, reject) => {
		axios
			.put('/updateStartingCapital', data)
			.then((rev) => {
				resolve(rev);
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			});
	});
};

export const deleteStartignCapital = async (data) => {
	return new Promise((resolve, reject) => {
		axios
			.post('/deleteStartingCapital', data)
			.then((rev) => {
				resolve(rev);
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			});
	});
};
