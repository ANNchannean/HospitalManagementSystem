import QRCode from 'qrcode';
export async function generateQR(text: string) {
	try {
		// console.log(await QRCode.toDataURL(text));
		return await QRCode.toDataURL(text);
	} catch (err) {
		console.error(err);
	}
}
export function now_datetime() {
	// return moment().format('YYYY-M-D h:mm:ss');
	return new Intl.DateTimeFormat('en-GB', {
		dateStyle: 'short'
	})
		.format(new Date())
		.split('/')
		.reverse()
		.join('-')
		.concat(' ')
		.concat(new Intl.DateTimeFormat('en-GB', { timeStyle: 'medium' }).format(new Date()));
}

export function now_datetime_number() {
	return Intl.DateTimeFormat('en-GB', { dateStyle: 'short' })
		.format(new Date())
		.split('/')
		.reverse()
		.join('')
		.concat(
			Intl.DateTimeFormat('en-GB', { timeStyle: 'medium' }).format(new Date()).split(':').join('')
		);
}

export function pagination(page: number, limit: number) {
	const currenctPage = page || 1;
	const offset = limit * (currenctPage - 1);
	return {
		limit,
		offset
	};
}
