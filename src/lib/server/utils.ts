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

