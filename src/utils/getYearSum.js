export const getYearSum = (data, value) => {
	if (!value) {
		return;
	}
	let result = data.reduce(function (acc, obj) {
		let key = new Date(obj.startDate).getFullYear();
		acc[key] = (acc[key] || 0) + +obj[value];
		return acc;
	}, Object.create(null));

	// console.log(result);
	return result;
};
export const duplicateCounter = (sales) => {
    if (sales) {
        const result = [
            ...sales.inputs
                .sort((a, b) => parseFloat(new Date(a.startDate).getFullYear()) - parseFloat(new Date(b.startDate).getFullYear()))
                .reduce((mp, o) => {
                    if (!mp.has(new Date(o.startDate).getFullYear())) mp.set(new Date(o.startDate).getFullYear(), { ...o, count: 0 });
                    mp.get(new Date(o.startDate).getFullYear()).count++;
                    return mp;
                }, new Map())
                .values(),
        ];
        return result;
    }
};

export const getTotal = data => {
  
	let result = data.reduce(function (acc, obj) {
		let key = new Date(obj.startDate).getFullYear();
		acc[key] = (acc[key] || 0) + +parseFloat(obj.salary) + parseFloat(obj.taxes) + parseFloat(obj.commissions);
		return acc;
	}, Object.create(null));

	// console.log(result);
	return result;
}
