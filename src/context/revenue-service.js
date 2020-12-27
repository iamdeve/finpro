import axios from './axios';

export const addPlan = async (data) => {
	return new Promise((resolve, reject) => {
		axios
			.post('/revenue/addRevenue', data)
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
			.post('/revenue/deleteRevenue', data)
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
			.put('/revenue/updateRevenue', data)
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
			.post('/revenue/addExpense', data)
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
			.put('/revenue/updateExpense', data)
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
			.post('/revenue/deleteExpense', data)
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
			.post('/revenue/addStartingCapital', data)
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
			.put('/revenue/updateStartingCapital', data)
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
			.post('/revenue/deleteStartingCapital', data)
			.then((rev) => {
				resolve(rev);
			})
			.catch((err) => {
				console.log(err);
				reject(err);
			});
	});
};


