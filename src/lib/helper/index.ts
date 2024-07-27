export function dobToAge({ d, m, y, date }: { d: number; m: number; y: number; date: Date }) {
	let now = date;
	let now_d = now.getDate();
	let now_m = now.getMonth() + 1;
	let now_y = now.getFullYear();
	let daysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();
	if (d > now_d) {
		now_d = now_d + daysInMonth(now_y, now_m);
		now_m = now_m - 1;
	}
	if (m > now_m) {
		now_m = now_m + 12;
		now_y = now_y - 1;
	}

	return {
		d: now_d - d,
		m: now_m - m,
		y: now_y - y
	};
}

export const now_date = function (date: string) {
	// return moment().format('YYYY-M-D h:mm:ss');
	return new Intl.DateTimeFormat('en-GB', {
		dateStyle: 'short'
	})
		.format(new Date(date))
		.split('/')
		.reverse()
		.join('-');
};
export const now_datetime = function (date: string) {
	// return moment().format('YYYY-M-D h:mm:ss');
	return new Intl.DateTimeFormat('en-GB', {
		dateStyle: 'short',
		timeStyle: 'short',
		hour12: true
	})
		.format(new Date(date))
		.split('/')
		.reverse()
		.join('-');
};
