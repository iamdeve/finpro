export const getYear = (data) => {
	console.log(data);
	if (data) {
		data = [...data];
		// data.slice(Math.max(data.length - 5, 0));
		const headings = [
			...data
				.sort((a, b) => parseFloat(new Date(a.date).getFullYear()) - parseFloat(new Date(b.startDate).getFullYear()))
				.reduce((mp, o) => {
					if (!mp.has(new Date(o.date).getFullYear())) mp.set(new Date(o.date).getFullYear(), { ...o, count: 0 });
					mp.get(new Date(o.date).getFullYear()).count++;
					return mp;
				}, new Map())
				.values(),
		];

		const plans = [
			...data
				.sort((a, b) => parseFloat(new Date(a.date).getFullYear()) - parseFloat(new Date(b.startDate).getFullYear()))
				.reduce((mp, o) => {
					if (!mp.has(o.plan)) mp.set(o.plan, { ...o, count: 0 });
					mp.get(o.plan).count++;
					return mp;
				}, new Map())
				.values(),
		];
		let total = data.reduce(function (acc, obj) {
			let key = obj.plan;
			acc[key] = (acc[key] || 0) + +parseFloat(obj.price);
			return acc;
		}, Object.create(null));

		console.log({ headings, plans, total });
		return { headings, total };
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
export const getQuarter = (data, date = 'startDate', value) => {
	let Q1 = [];
	if (data === undefined) return;

	// console.log(data);
	data.slice(Math.max(data.length - 5, 0));
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

	let salaries = Q1.reduce(function (acc, obj) {
		let key = obj.quarter;
		acc[key] = (acc[key] || 0) + +obj.salary;
		return acc;
	}, Object.create(null));

	let taxes = Q1.reduce(function (acc, obj) {
		let key = obj.quarter;
		acc[key] = (acc[key] || 0) + +obj.taxes;
		return acc;
	}, Object.create(null));

	let commissions = Q1.reduce(function (acc, obj) {
		let key = obj.quarter;
		acc[key] = (acc[key] || 0) + +obj.commissions;
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
	// console.log({ headings, salaries, taxes, commissions, total });
	return { headings, salaries, taxes, commissions, total };
};

export const getMonthDetails = (data, date = 'startDate', value) => {
	if (data === undefined) return;
	let Q1 = [];
	// console.log(data);
	data.slice(Math.max(data.length - 5, 0));
	data.forEach((d) => {
		if (new Date(d[date]).getMonth() === 0) {
			Q1.push({ ...d, month: getMonthName(new Date(d[date]).getMonth() + 1) + ' ' + new Date(d[date]).getFullYear() });
		} else if (new Date(d[date]).getMonth() === 1) {
			Q1.push({ ...d, month: getMonthName(new Date(d[date]).getMonth() + 1) + +' ' + new Date(d[date]).getFullYear() });
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

	let salaries = Q1.reduce(function (acc, obj) {
		let key = obj.month;
		acc[key] = (acc[key] || 0) + +obj.salary;
		return acc;
	}, Object.create(null));

	let taxes = Q1.reduce(function (acc, obj) {
		let key = obj.month;
		acc[key] = (acc[key] || 0) + +obj.taxes;
		return acc;
	}, Object.create(null));

	let commissions = Q1.reduce(function (acc, obj) {
		let key = obj.month;
		acc[key] = (acc[key] || 0) + +obj.commissions;
		return acc;
	}, Object.create(null));

	let total = Q1.reduce(function (acc, obj) {
		let key = obj.month;
		acc[key] = (acc[key] || 0) + +parseFloat(obj.salary) + parseFloat(obj.taxes) + parseFloat(obj.commissions);
		return acc;
	}, Object.create(null));

	const headings = [
		...Q1.sort((a, b) => parseFloat(new Date(a.startDate).getFullYear()) - parseFloat(new Date(b.startDate).getFullYear()))
			.reduce((mp, o) => {
				if (!mp.has(o.month)) mp.set(o.month, { ...o, count: 0 });
				mp.get(o.month).count++;
				return mp;
			}, new Map())
			.values(),
	];
	// console.log({ headings, salaries, taxes, commissions, total });
	return { headings, salaries, taxes, commissions, total };
};
