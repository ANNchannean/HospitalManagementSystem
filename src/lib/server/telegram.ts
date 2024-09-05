const bot_token = '7489978998:AAFDjxR71l9EQgyJo8cBaUnc0nH5jM8A2PE';
const chat_id = '338746948';
export async function billingMessage(text: string) {
	try {
		const msg = new Intl.DateTimeFormat('en-US', {
			dateStyle: 'short',
			timeStyle: 'short',
			hour12: true
		})
			.format(new Date())
			.concat('%0A')
			.concat(text);

		const req = await fetch(
			`https://api.telegram.org/bot${bot_token}/sendMessage?chat_id=${chat_id}&text=${msg}`,
			{
				method: 'GET',
				redirect: 'follow'
			}
		);
		const res = await req.json();
		if (!res.ok) {
			console.log(res);
		}
	} catch (error) {
		console.log(error);
	}
}
export async function logErrorMessage(text: string) {
	try {
		const msg = new Intl.DateTimeFormat('en-US', {
			dateStyle: 'short',
			timeStyle: 'short',
			hour12: true
		})
			.format(new Date())
			.concat('%0A')
			.concat(JSON.stringify(text));

		const req = await fetch(
			`https://api.telegram.org/bot${bot_token}/sendMessage?chat_id=${chat_id}&text=${msg}`,
			{
				method: 'GET',
				redirect: 'follow'
			}
		);
		const res = await req.json();

		if (!res.ok) {
			console.log(res);
		}
		if (res.ok) {
			console.log(res.result.text);
		}
	} catch (error) {
		console.log(error);
	}
}
