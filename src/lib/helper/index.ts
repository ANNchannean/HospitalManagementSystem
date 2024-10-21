export function dobToAge({ dob, date }: { dob: string | undefined; date: string | undefined }) {
	if (!dob || !date || dob.length < 10) {
		return {
			d: 'd',
			m: 'm',
			y: 'y'
		};
	}
	if (date.length < 10) {
		return {
			d: 'd',
			m: 'm',
			y: 'y'
		};
	}
	let now_d = Number(date.slice(8, 10));
	let now_m = Number(date.slice(5, 7));
	let now_y = Number(date.slice(0, 4));
	const d = Number(dob.slice(8, 10));
	const m = Number(dob.slice(5, 7));
	const y = Number(dob.slice(0, 4));

	const daysInMonth = (year: number, month: number) =>
		new Date(year, month, 0).toJSON().slice(8, 10);
	if (d > now_d) {
		now_d = now_d + Number(daysInMonth(now_y, now_m));
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

export function now_date(date: string) {
	// return moment().format('YYYY-M-D h:mm:ss');
	return new Intl.DateTimeFormat('en-GB', {
		dateStyle: 'short'
	})
		.format(new Date(date))
		.split('/')
		.reverse()
		.join('-');
}
export function now_datetime(date: string) {
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
}
