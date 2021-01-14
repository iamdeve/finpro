export const getYear = (data) => {
	// console.log(data);
	if (data) {
		data = [...data];
		data.slice(Math.max(data.length - 5, 0));
		const headings = [
			...data
				.sort((a, b) => parseFloat(new Date(a.startDate).getFullYear()) - parseFloat(new Date(b.startDate).getFullYear()))
				.reduce((mp, o) => {
					if (!mp.has(new Date(o.startDate).getFullYear())) mp.set(new Date(o.startDate).getFullYear(), { ...o, count: 0 });
					mp.get(new Date(o.startDate).getFullYear()).count++;
					return mp;
				}, new Map())
				.values(),
		];

		let salaries = data.reduce(function (acc, obj) {
			let key = new Date(obj.startDate).getFullYear();
			acc[key] = (acc[key] || 0) + +obj.salary;
			return acc;
		}, Object.create(null));

		let taxes = data.reduce(function (acc, obj) {
			let key = new Date(obj.startDate).getFullYear();
			acc[key] = (acc[key] || 0) + +obj.taxes;
			return acc;
		}, Object.create(null));

		let commissions = data.reduce(function (acc, obj) {
			let key = new Date(obj.startDate).getFullYear();
			acc[key] = (acc[key] || 0) + +obj.commissions;
			return acc;
		}, Object.create(null));

		let total = data.reduce(function (acc, obj) {
			let key = new Date(obj.startDate).getFullYear();
			acc[key] = (acc[key] || 0) + +parseFloat(obj.salary) + parseFloat(obj.taxes) + parseFloat(obj.commissions);
			return acc;
		}, Object.create(null));

		for (let i = 0; i < headings.length; i++) {
			if (i > 0) {
				headings[i].count = headings[i - 1].count + headings[i].count;
			}
		}

		let newSalary = Object.create({});
		for (let i = 0; i < Object.values(salaries).length; i++) {
			if (i > 0) {
				newSalary[`${Object.keys(salaries)[i]}`] = Object.values(salaries)[i] + Object.values(newSalary)[i - 1];
			} else {
				newSalary[`${Object.keys(salaries)[i]}`] = Object.values(salaries)[i];
			}
		}
		let newTaxes = Object.create({});
		for (let i = 0; i < Object.values(taxes).length; i++) {
			if (i > 0) {
				newTaxes[`${Object.keys(taxes)[i]}`] = Object.values(taxes)[i] + Object.values(newTaxes)[i - 1];
			} else {
				newTaxes[`${Object.keys(taxes)[i]}`] = Object.values(taxes)[i];
			}
		}

		let newCommssions = Object.create({});
		for (let i = 0; i < Object.values(commissions).length; i++) {
			if (i > 0) {
				newCommssions[`${Object.keys(commissions)[i]}`] = Object.values(commissions)[i] + Object.values(newCommssions)[i - 1];
			} else {
				newCommssions[`${Object.keys(commissions)[i]}`] = Object.values(commissions)[i];
			}
		}

		let newTotal = Object.create({});
		for (let i = 0; i < Object.values(total).length; i++) {
			// console.log(Object.values(newSalary)[i] + Object.values(newTaxes)[i] + Object.values(newCommssions)[i]);
			newTotal[Object.keys(total)[i]] = Object.values(newSalary)[i] + Object.values(newTaxes)[i] + Object.values(newCommssions)[i];
		}
		// console.log(newTotal);
		// console.log({ headings, salaries, taxes, commissions, total });
		return { headings, salaries: newSalary, taxes: newTaxes, commissions: newCommssions, total: newTotal };
	}
};

export const getMonthName = (digit) => {
	switch (digit) {
		case 1:
			return 'Jan';
		case 2:
			return 'Feb';
		case 3:
			return 'Mar';
		case 4:
			return 'Apr';
		case 5:
			return 'May';
		case 6:
			return 'Jun';
		case 7:
			return 'Jul';
		case 8:
			return 'Aug';
		case 9:
			return 'Sep';
		case 10:
			return 'Oct';
		case 11:
			return 'Nov';
		case 12:
			return 'Dec';
		default:
			return;
	}
};

function quarter(digit, year) {
	switch (digit) {
		case 0:
			return 'Jan-Mar ' + year;
		case 1:
			return 'Apr-Jun ' + year;
		case 2:
			return 'Jul-Sep ' + year;
		case 3:
			return 'Oct-Dec ' + year;
		default:
			return;
	}
}

export const setQuarterLabel = () => {
	let arr = [];
	let today = new Date().getFullYear();
	for (let i = 0; i < 5; i++) {
		for (let j = 0; j < 3; j++) {
			arr.push(quarter(j, today + i));
		}
	}
	return arr;
};
export const getQuarter = (data, date = 'startDate', value) => {
	let Q1 = [];
	if (data === undefined) return;

	// console.log(data);
	// data.slice(Math.max(data.length - 5, 0));
	data.forEach((d) => {
		if (new Date(d[date]).getMonth() === 0 || new Date(d[date]).getMonth() === 1 || new Date(d[date]).getMonth() === 2) {
			Q1.push({ ...d, quarter: 'Jan-Mar ' + new Date(d[date]).getFullYear() });
		} else if (new Date(d[date]).getMonth() === 3 || new Date(d[date]).getMonth() === 4 || new Date(d[date]).getMonth() === 5) {
			Q1.push({ ...d, quarter: 'Apr-Jun ' + new Date(d[date]).getFullYear() });
		} else if (new Date(d[date]).getMonth() === 6 || new Date(d[date]).getMonth() === 7 || new Date(d[date]).getMonth() === 8) {
			Q1.push({ ...d, quarter: 'Jul-Sep ' + new Date(d[date]).getFullYear() });
		} else if (new Date(d[date]).getMonth() === 9 || new Date(d[date]).getMonth() === 10 || new Date(d[date]).getMonth() === 11) {
			Q1.push({ ...d, quarter: 'Oct-Dec ' + new Date(d[date]).getFullYear() });
		}
	});
	// console.log(Q1);

	Q1.sort((a, b) => {
		if (new Date(a.startDate).getFullYear() !== new Date(b.startDate).getFullYear()) return new Date(a.startDate).getFullYear() - new Date(b.startDate).getFullYear();
		return Months.indexOf(getMonthName(new Date(a.startDate).getMonth())) - Months.indexOf(getMonthName(new Date(b.startDate).getMonth()));
	});

	let salaries = Q1.reduce(function (acc, obj) {
		let key = obj.quarter;
		acc[key] = (acc[key] || 0) + +obj.salary / 4;
		return acc;
	}, Object.create(null));

	let taxes = Q1.reduce(function (acc, obj) {
		let key = obj.quarter;
		acc[key] = (acc[key] || 0) + +(((obj.taxes / 100) * obj.salary) / 4);
		return acc;
	}, Object.create(null));

	let commissions = Q1.reduce(function (acc, obj) {
		let key = obj.quarter;
		acc[key] = (acc[key] || 0) + +obj.commissions / 4;
		return acc;
	}, Object.create(null));

	let total = Q1.reduce(function (acc, obj) {
		let key = obj.quarter;
		acc[key] = (acc[key] || 0) + +parseFloat(obj.salary) + parseFloat(obj.taxes) + parseFloat(obj.commissions);
		return acc;
	}, Object.create(null));

	const headings = [
		...Q1.sort((a, b) => parseFloat(new Date(a.startDate).getFullYear()) - parseFloat(new Date(b.startDate).getFullYear()))
			.reduce((mp, o) => {
				if (!mp.has(o.quarter)) mp.set(o.quarter, { ...o, count: 0 });
				mp.get(o.quarter).count++;
				return mp;
			}, new Map())
			.values(),
	];

	for (let i = 0; i < headings.length; i++) {
		if (i > 0) {
			headings[i].count = headings[i - 1].count + headings[i].count;
		}
	}

	let newSalary = Object.create({});
	for (let i = 0; i < Object.values(salaries).length; i++) {
		if (i > 0) {
			newSalary[`${Object.keys(salaries)[i]}`] = Object.values(salaries)[i] + Object.values(newSalary)[i - 1];
		} else {
			newSalary[`${Object.keys(salaries)[i]}`] = Object.values(salaries)[i];
		}
	}
	let newTaxes = Object.create({});
	for (let i = 0; i < Object.values(taxes).length; i++) {
		if (i > 0) {
			newTaxes[`${Object.keys(taxes)[i]}`] = Object.values(taxes)[i] + Object.values(newTaxes)[i - 1];
		} else {
			newTaxes[`${Object.keys(taxes)[i]}`] = Object.values(taxes)[i];
		}
	}

	let newCommssions = Object.create({});
	for (let i = 0; i < Object.values(commissions).length; i++) {
		if (i > 0) {
			newCommssions[`${Object.keys(commissions)[i]}`] = Object.values(commissions)[i] + Object.values(newCommssions)[i - 1];
		} else {
			newCommssions[`${Object.keys(commissions)[i]}`] = Object.values(commissions)[i];
		}
	}
	let newTotal = Object.create({});
	for (let i = 0; i < Object.values(total).length; i++) {
		newTotal[Object.keys(total)[i]] = Object.values(newSalary)[i] + Object.values(newTaxes)[i] + Object.values(newCommssions)[i];
	}

	// console.log({ headings, salaries, taxes, commissions, total });
	return { headings, salaries: newSalary, taxes: newTaxes, commissions: newCommssions, total: newTotal, allTotal: total };
};

export const Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const getMonthDetails = (data, date = 'startDate', value) => {
	if (data === undefined) return;
	let Q1 = [];
	// console.log(data);
	// data.slice(Math.max(data.length - 5, 0));
	data.forEach((d) => {
		if (new Date(d[date]).getMonth() === 0) {
			Q1.push({ ...d, month: getMonthName(new Date(d[date]).getMonth() + 1) + ' ' + new Date(d[date]).getFullYear() });
		} else if (new Date(d[date]).getMonth() === 1) {
			Q1.push({ ...d, month: getMonthName(new Date(d[date]).getMonth() + 1) + ' ' + new Date(d[date]).getFullYear() });
		} else if (new Date(d[date]).getMonth() === 2) {
			Q1.push({ ...d, month: getMonthName(new Date(d[date]).getMonth() + 1) + ' ' + new Date(d[date]).getFullYear() });
		} else if (new Date(d[date]).getMonth() === 3) {
			Q1.push({ ...d, month: getMonthName(new Date(d[date]).getMonth() + 1) + ' ' + new Date(d[date]).getFullYear() });
		} else if (new Date(d[date]).getMonth() === 4) {
			Q1.push({ ...d, month: getMonthName(new Date(d[date]).getMonth() + 1) + ' ' + new Date(d[date]).getFullYear() });
		} else if (new Date(d[date]).getMonth() === 5) {
			Q1.push({ ...d, month: getMonthName(new Date(d[date]).getMonth() + 1) + ' ' + new Date(d[date]).getFullYear() });
		} else if (new Date(d[date]).getMonth() === 6) {
			Q1.push({ ...d, month: getMonthName(new Date(d[date]).getMonth() + 1) + ' ' + new Date(d[date]).getFullYear() });
		} else if (new Date(d[date]).getMonth() === 7) {
			Q1.push({ ...d, month: getMonthName(new Date(d[date]).getMonth() + 1) + ' ' + new Date(d[date]).getFullYear() });
		} else if (new Date(d[date]).getMonth() === 8) {
			Q1.push({ ...d, month: getMonthName(new Date(d[date]).getMonth() + 1) + ' ' + new Date(d[date]).getFullYear() });
		} else if (new Date(d[date]).getMonth() === 9) {
			Q1.push({ ...d, month: getMonthName(new Date(d[date]).getMonth() + 1) + ' ' + new Date(d[date]).getFullYear() });
		} else if (new Date(d[date]).getMonth() === 10) {
			Q1.push({ ...d, month: getMonthName(new Date(d[date]).getMonth() + 1) + ' ' + new Date(d[date]).getFullYear() });
		} else if (new Date(d[date]).getMonth() === 11) {
			Q1.push({ ...d, month: getMonthName(new Date(d[date]).getMonth() + 1) + ' ' + new Date(d[date]).getFullYear() });
		}
	});

	Q1.sort((a, b) => {
		if (new Date(a.startDate).getFullYear() !== new Date(b.startDate).getFullYear()) return new Date(a.startDate).getFullYear() - new Date(b.startDate).getFullYear();
		return Months.indexOf(getMonthName(new Date(a.startDate).getMonth())) - Months.indexOf(getMonthName(new Date(b.startDate).getMonth()));
	});

	let salaries = Q1.reduce(function (acc, obj) {
		let key = obj.month;
		acc[key] = (acc[key] || 0) + +obj.salary / 12;
		return acc;
	}, Object.create(null));

	let taxes = Q1.reduce(function (acc, obj) {
		let key = obj.month;
		acc[key] = (acc[key] || 0) + +(((obj.taxes / 100) * obj.salary) / 12);
		return acc;
	}, Object.create(null));

	let commissions = Q1.reduce(function (acc, obj) {
		let key = obj.month;
		acc[key] = (acc[key] || 0) + +obj.commissions / 12;
		return acc;
	}, Object.create(null));

	let total = Q1.reduce(function (acc, obj) {
		let key = obj.month;
		acc[key] = (acc[key] || 0) + +parseFloat(obj.salary) + parseFloat(obj.taxes) + parseFloat(obj.commissions);
		return acc;
	}, Object.create(null));

	const headings = [
		...Q1.sort((a, b) => {
			if (new Date(a.startDate).getFullYear() !== new Date(b.startDate).getFullYear()) return new Date(a.startDate).getFullYear() - new Date(b.startDate).getFullYear();
			return Months.indexOf(getMonthName(new Date(a.startDate).getMonth())) - Months.indexOf(getMonthName(new Date(b.startDate).getMonth()));
		})
			.reduce((mp, o) => {
				if (!mp.has(o.month)) mp.set(o.month, { ...o, count: 0 });
				mp.get(o.month).count++;
				return mp;
			}, new Map())
			.values(),
	];

	for (let i = 0; i < headings.length; i++) {
		if (i > 0) {
			headings[i].count = headings[i - 1].count + headings[i].count;
		}
	}

	let newSalary = Object.create({});
	for (let i = 0; i < Object.values(salaries).length; i++) {
		if (i > 0) {
			newSalary[`${Object.keys(salaries)[i]}`] = Object.values(salaries)[i] + Object.values(newSalary)[i - 1];
		} else {
			newSalary[`${Object.keys(salaries)[i]}`] = Object.values(salaries)[i];
		}
	}
	let newTaxes = Object.create({});
	for (let i = 0; i < Object.values(taxes).length; i++) {
		if (i > 0) {
			newTaxes[`${Object.keys(taxes)[i]}`] = Object.values(taxes)[i] + Object.values(newTaxes)[i - 1];
		} else {
			newTaxes[`${Object.keys(taxes)[i]}`] = Object.values(taxes)[i];
		}
	}

	let newCommssions = Object.create({});
	for (let i = 0; i < Object.values(commissions).length; i++) {
		if (i > 0) {
			newCommssions[`${Object.keys(commissions)[i]}`] = Object.values(commissions)[i] + Object.values(newCommssions)[i - 1];
		} else {
			newCommssions[`${Object.keys(commissions)[i]}`] = Object.values(commissions)[i];
		}
	}
	let newTotal = Object.create({});
	for (let i = 0; i < Object.values(total).length; i++) {
		newTotal[Object.keys(total)[i]] = Object.values(newSalary)[i] + Object.values(newTaxes)[i] + Object.values(newCommssions)[i];
	}

	// console.log({ headings, salaries, taxes, commissions, total });
	return { headings, salaries: newSalary, taxes: newTaxes, commissions: newCommssions, total: newTotal };
};

export const getYearExpenses = (inputs, key) => {
	let salesTotal = 0;
	let marketingTotal = 0;
	let randdTotal = 0;
	let gandaTotal = 0;
	inputs.forEach((input) => {
		if (input.title === 'sales') {
			let eat = 0,
				das = 0,
				tae = 0,
				o = 0,
				c = 0;
			let sales = getYear(input.inputs);
			input.majorExpenseInput.forEach((expense) => {
				if (expense.heading === 'equipmentAndTelecom') {
					eat += parseFloat(expense.cost);
				} else if (expense.heading === 'duesAnsSubscriptions') {
					das += parseFloat(expense.cost);
				} else if (expense.heading === 'travelAndEntertainment') {
					tae += parseFloat(expense.cost);
				} else if (expense.heading === 'others') {
					o += parseFloat(expense.cost);
				} else if (expense.heading === 'contractor') {
					c += parseFloat(expense.cost);
				}
			});
			if (sales.headings.length > 0 && key <= sales.headings.length - 1) {
				for (let i = 0; i < 1; i++) {
					eat = eat * sales.headings[key].count;
					das = das * 12 * sales.headings[key].count;
					tae = tae * 12 * sales.headings[key].count;
					c = c * 12;
				}
			}

			salesTotal = eat + das + tae + o + c + Object.values(sales.total)[key] ? Object.values(sales.total)[key] : 0;
		} else if (input.title === 'marketing') {
			let eat = 0,
				das = 0,
				tae = 0,
				om = 0,
				o = 0,
				t = 0,
				c = 0;
			let marketing = getYear(input.inputs);
			input.majorExpenseInput.forEach((expense) => {
				if (expense.heading === 'equipmentAndTelecom') {
					eat += parseFloat(expense.cost);
				} else if (expense.heading === 'duesAnsSubscriptions') {
					das += parseFloat(expense.cost);
				} else if (expense.heading === 'travelAndEntertainment') {
					tae += parseFloat(expense.cost);
				} else if (expense.heading === 'onlineMarketing') {
					om += parseFloat(expense.cost);
				} else if (expense.heading === 'tradeShows') {
					t += parseFloat(expense.cost);
				} else if (expense.heading === 'others') {
					o += parseFloat(expense.cost);
				} else if (expense.heading === 'contractor') {
					c += parseFloat(expense.cost);
				}
			});
			if (marketing.headings.length > 0 && key <= marketing.headings.length - 1) {
				for (let i = 0; i < 1; i++) {
					eat = eat * marketing.headings[key].count;
					das = das * 12 * marketing.headings[key].count;
					tae = tae * 12 * marketing.headings[key].count;
					om = om * 12;
					c = c * 12;
					t = t * 4;
				}
			}
			marketingTotal = eat + das + tae + o + c + t + om + Object.values(marketing.total)[key] ? Object.values(marketing.total)[key] : 0;
		} else if (input.title === 'randd') {
			let eat = 0,
				das = 0,
				tae = 0,
				o = 0,
				c = 0;
			let randd = getYear(input.inputs);
			input.majorExpenseInput.forEach((expense) => {
				if (expense.heading === 'equipmentAndTelecom') {
					eat += parseFloat(expense.cost);
				} else if (expense.heading === 'duesAnsSubscriptions') {
					das += parseFloat(expense.cost);
				} else if (expense.heading === 'travelAndEntertainment') {
					tae += parseFloat(expense.cost);
				} else if (expense.heading === 'others') {
					o += parseFloat(expense.cost);
				} else if (expense.heading === 'contractor') {
					c += parseFloat(expense.cost);
				}
			});
			if (randd.headings.length > 0 && key <= randd.headings.length - 1) {
				for (let i = 0; i < 1; i++) {
					eat = eat * randd.headings[key].count;
					das = das * 12 * randd.headings[key].count;
					tae = tae * 12 * randd.headings[key].count;
					c = c * 12;
				}
			}

			randdTotal = eat + das + tae + o + c + Object.values(randd.total)[key] ? Object.values(randd.total)[key] : 0;
		} else if (input.title === 'ganda') {
			let eat = 0,
				das = 0,
				tae = 0,
				os = 0,
				o = 0,
				c = 0;
			let ganda = getYear(input.inputs);
			input.majorExpenseInput.forEach((expense) => {
				if (expense.heading === 'equipmentAndTelecom') {
					eat += parseFloat(expense.cost);
				} else if (expense.heading === 'duesAnsSubscriptions') {
					das += parseFloat(expense.cost);
				} else if (expense.heading === 'travelAndEntertainment') {
					tae += parseFloat(expense.cost);
				} else if (expense.heading === 'others') {
					o += parseFloat(expense.cost);
				} else if (expense.heading === 'officeSpace') {
					os += parseFloat(expense.cost);
				} else if (expense.heading === 'contractor') {
					c += parseFloat(expense.cost);
				}
			});
			if (ganda.headings.length > 0 && key <= ganda.headings.length - 1) {
				for (let i = 0; i < 1; i++) {
					eat = eat * ganda.headings[key].count;
					das = das * 12 * ganda.headings[key].count;
					tae = tae * 12 * ganda.headings[key].count;
					c = c * 12;
					os = os * 12;
				}
			}

			gandaTotal = eat + das + tae + o + c + os + Object.values(ganda.total)[key] ? Object.values(ganda.total)[key] : 0;
		}
	});

	// console.log(salesTotal, marketingTotal, randdTotal, gandaTotal);
	return salesTotal + marketingTotal + randdTotal + gandaTotal;
};

export const getYearEbit = (inputs, key) => {
	let salesTotal = 0;
	let marketingTotal = 0;
	let randdTotal = 0;
	let gandaTotal = 0;
	inputs.forEach((input) => {
		if (input.title === 'sales') {
			let eat = 0;
			let sales = getYear(input.inputs);
			input.majorExpenseInput.forEach((expense) => {
				if (expense.heading === 'equipmentAndTelecom') {
					eat += parseFloat(expense.cost);
				}
			});
			if (sales.headings.length > 0 && key <= sales.headings.length - 1) {
				for (let i = 0; i < 1; i++) {
					eat = eat * sales.headings[key].count;
				}
			}

			salesTotal = eat;
		} else if (input.title === 'marketing') {
			let eat = 0;
			let marketing = getYear(input.inputs);
			input.majorExpenseInput.forEach((expense) => {
				if (expense.heading === 'equipmentAndTelecom') {
					eat += parseFloat(expense.cost);
				}
			});
			if (marketing.headings.length > 0 && key <= marketing.headings.length - 1) {
				for (let i = 0; i < 1; i++) {
					eat = eat * marketing.headings[key].count;
				}
			}
			marketingTotal = eat;
		} else if (input.title === 'randd') {
			let eat = 0;
			let randd = getYear(input.inputs);
			input.majorExpenseInput.forEach((expense) => {
				if (expense.heading === 'equipmentAndTelecom') {
					eat += parseFloat(expense.cost);
				}
			});

			if (randd.headings.length > 0 && key <= randd.headings.length - 1) {
				for (let i = 0; i < 1; i++) {
					eat = eat * randd.headings[key].count;
				}
			}

			randdTotal = eat;
		} else if (input.title === 'ganda') {
			let eat = 0;
			let ganda = getYear(input.inputs);
			input.majorExpenseInput.forEach((expense) => {
				if (expense.heading === 'equipmentAndTelecom') {
					eat += parseFloat(expense.cost);
				}
			});
			if (ganda.headings.length > 0 && key <= ganda.headings.length - 1) {
				for (let i = 0; i < 1; i++) {
					eat = eat * ganda.headings[key].count;
				}
			}

			gandaTotal = eat;
		}
	});

	// console.log(salesTotal, marketingTotal, randdTotal, gandaTotal);
	return salesTotal + marketingTotal + randdTotal + gandaTotal;
};

export const getQuarterExpenses = (inputs, key) => {
	let salesTotal = 0;
	let marketingTotal = 0;
	let randdTotal = 0;
	let gandaTotal = 0;
	inputs.forEach((input) => {
		if (input.title === 'sales') {
			let eat = 0,
				das = 0,
				tae = 0,
				o = 0,
				c = 0;
			let sales = getQuarter(input.inputs);
			input.majorExpenseInput.forEach((expense) => {
				if (expense.heading === 'equipmentAndTelecom') {
					eat += parseFloat(expense.cost);
				} else if (expense.heading === 'duesAnsSubscriptions') {
					das += parseFloat(expense.cost);
				} else if (expense.heading === 'travelAndEntertainment') {
					tae += parseFloat(expense.cost);
				} else if (expense.heading === 'others') {
					o += parseFloat(expense.cost);
				} else if (expense.heading === 'contractor') {
					c += parseFloat(expense.cost);
				}
			});
			if (sales.headings.length > 0 && key <= sales.headings.length - 1) {
				for (let i = 0; i < 1; i++) {
					// console.log(sales.headings[key])
					eat = eat * sales.headings[key].count;
					das = das * 4 * sales.headings[key].count;
					tae = tae * 4 * sales.headings[key].count;
					c = c * 4;
				}
			}

			salesTotal = eat + das + tae + o + c + Object.values(sales.total)[key] ? Object.values(sales.total)[key] : 0;
		} else if (input.title === 'marketing') {
			let eat = 0,
				das = 0,
				tae = 0,
				om = 0,
				o = 0,
				t = 0,
				c = 0;
			let marketing = getQuarter(input.inputs);
			input.majorExpenseInput.forEach((expense) => {
				if (expense.heading === 'equipmentAndTelecom') {
					eat += parseFloat(expense.cost);
				} else if (expense.heading === 'duesAnsSubscriptions') {
					das += parseFloat(expense.cost);
				} else if (expense.heading === 'travelAndEntertainment') {
					tae += parseFloat(expense.cost);
				} else if (expense.heading === 'onlineMarketing') {
					om += parseFloat(expense.cost);
				} else if (expense.heading === 'tradeShows') {
					t += parseFloat(expense.cost);
				} else if (expense.heading === 'others') {
					o += parseFloat(expense.cost);
				} else if (expense.heading === 'contractor') {
					c += parseFloat(expense.cost);
				}
			});
			if (marketing.headings.length > 0 && key <= marketing.headings.length - 1) {
				for (let i = 0; i < 1; i++) {
					eat = eat * marketing.headings[key].count;
					das = das * 4 * marketing.headings[key].count;
					tae = tae * 4 * marketing.headings[key].count;
					om = om * 4;
					c = c * 4;
					t = t * 4;
				}
			}
			marketingTotal = eat + das + tae + o + c + t + om + Object.values(marketing.total)[key] ? Object.values(marketing.total)[key] : 0;
		} else if (input.title === 'randd') {
			let eat = 0,
				das = 0,
				tae = 0,
				o = 0,
				c = 0;
			let randd = getQuarter(input.inputs);
			input.majorExpenseInput.forEach((expense) => {
				if (expense.heading === 'equipmentAndTelecom') {
					eat += parseFloat(expense.cost);
				} else if (expense.heading === 'duesAnsSubscriptions') {
					das += parseFloat(expense.cost);
				} else if (expense.heading === 'travelAndEntertainment') {
					tae += parseFloat(expense.cost);
				} else if (expense.heading === 'others') {
					o += parseFloat(expense.cost);
				} else if (expense.heading === 'contractor') {
					c += parseFloat(expense.cost);
				}
			});
			if (randd.headings.length > 0 && key <= randd.headings.length - 1) {
				for (let i = 0; i < 1; i++) {
					eat = eat * randd.headings[key].count;
					das = das * 4 * randd.headings[key].count;
					tae = tae * 4 * randd.headings[key].count;
					c = c * 4;
				}
			}

			randdTotal = eat + das + tae + o + c + Object.values(randd.total)[key] ? Object.values(randd.total)[key] : 0;
		} else if (input.title === 'ganda') {
			let eat = 0,
				das = 0,
				tae = 0,
				os = 0,
				o = 0,
				c = 0;
			let ganda = getQuarter(input.inputs);
			input.majorExpenseInput.forEach((expense) => {
				if (expense.heading === 'equipmentAndTelecom') {
					eat += parseFloat(expense.cost);
				} else if (expense.heading === 'duesAnsSubscriptions') {
					das += parseFloat(expense.cost);
				} else if (expense.heading === 'travelAndEntertainment') {
					tae += parseFloat(expense.cost);
				} else if (expense.heading === 'others') {
					o += parseFloat(expense.cost);
				} else if (expense.heading === 'officeSpace') {
					os += parseFloat(expense.cost);
				} else if (expense.heading === 'contractor') {
					c += parseFloat(expense.cost);
				}
			});
			if (ganda.headings.length > 0 && key <= ganda.headings.length - 1) {
				for (let i = 0; i < 1; i++) {
					eat = eat * ganda.headings[key].count;
					das = das * 4 * ganda.headings[key].count;
					tae = tae * 4 * ganda.headings[key].count;
					c = c * 4;
					os = os * 4;
				}
			}

			gandaTotal = eat + das + tae + o + c + os + Object.values(ganda.total)[key] ? Object.values(ganda.total)[key] : 0;
		}
	});

	// console.log(salesTotal, marketingTotal, randdTotal, gandaTotal);
	return salesTotal + marketingTotal + randdTotal + gandaTotal;
};

export const getQuarterEbit = (inputs, key) => {
	let salesTotal = 0;
	let marketingTotal = 0;
	let randdTotal = 0;
	let gandaTotal = 0;
	inputs.forEach((input) => {
		if (input.title === 'sales') {
			let eat = 0;
			let sales = getQuarter(input.inputs);
			input.majorExpenseInput.forEach((expense) => {
				if (expense.heading === 'equipmentAndTelecom') {
					eat += parseFloat(expense.cost);
				}
			});
			if (sales.headings.length > 0 && key <= sales.headings.length - 1) {
				for (let i = 0; i < 1; i++) {
					eat = eat * sales.headings[key].count;
				}
			}

			salesTotal = eat;
		} else if (input.title === 'marketing') {
			let eat = 0;
			let marketing = getQuarter(input.inputs);
			input.majorExpenseInput.forEach((expense) => {
				if (expense.heading === 'equipmentAndTelecom') {
					eat += parseFloat(expense.cost);
				}
			});
			if (marketing.headings.length > 0 && key <= marketing.headings.length - 1) {
				for (let i = 0; i < 1; i++) {
					eat = eat * marketing.headings[key].count;
				}
			}
			marketingTotal = eat;
		} else if (input.title === 'randd') {
			let eat = 0;
			let randd = getQuarter(input.inputs);
			input.majorExpenseInput.forEach((expense) => {
				if (expense.heading === 'equipmentAndTelecom') {
					eat += parseFloat(expense.cost);
				}
			});

			if (randd.headings.length > 0 && key <= randd.headings.length - 1) {
				for (let i = 0; i < 1; i++) {
					eat = eat * randd.headings[key].count;
				}
			}

			randdTotal = eat;
		} else if (input.title === 'ganda') {
			let eat = 0;
			let ganda = getQuarter(input.inputs);
			input.majorExpenseInput.forEach((expense) => {
				if (expense.heading === 'equipmentAndTelecom') {
					eat += parseFloat(expense.cost);
				}
			});
			if (ganda.headings.length > 0 && key <= ganda.headings.length - 1) {
				for (let i = 0; i < 1; i++) {
					eat = eat * ganda.headings[key].count;
				}
			}

			gandaTotal = eat;
		}
	});

	// console.log(salesTotal, marketingTotal, randdTotal, gandaTotal);
	return salesTotal + marketingTotal + randdTotal + gandaTotal;
};
