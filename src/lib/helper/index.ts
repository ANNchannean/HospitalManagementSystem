export function dobToAge({ dob, date }: { dob: string; date: string }) {
	if (dob.length < 10) {
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
export type TCurrency =
	| {
			id: number;
			symbol: string;
			from_symbol: string;
			to_symbol: string;
			rate_to: number;
			rate_from: number;
			dialy_rate: number;
	  }
	| undefined;

export const rateFn = ({
	get_currency,
	amount,
	rate
}: {
	get_currency: TCurrency;
	amount: number;
	rate: number;
}) => {
	if (get_currency?.symbol === get_currency?.from_symbol) {
		return Math.ceil(amount * rate);
	} else if (get_currency?.symbol === get_currency?.to_symbol) {
		return amount;
	} else {
		return 0;
	}
};
