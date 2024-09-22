import QRCode from 'qrcode';
export const generateQR = async (text: string) => {
	try {
		// console.log(await QRCode.toDataURL(text));
		return await QRCode.toDataURL(text);
	} catch (err) {
		console.error(err);
	}
};
export const now_datetime = function () {
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
};

export const now_datetime_number = function () {
	return Intl.DateTimeFormat('en-GB', { dateStyle: 'short' })
		.format(new Date())
		.split('/')
		.reverse()
		.join('')
		.concat(
			Intl.DateTimeFormat('en-GB', { timeStyle: 'medium' }).format(new Date()).split(':').join('')
		);
};

export const pagination = function (page: number, limit: number) {
	const currenctPage = page || 1;
	const offset = limit * (currenctPage - 1);
	return {
		limit,
		offset
	};
};
