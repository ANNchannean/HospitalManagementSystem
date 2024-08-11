export async function sendTelegramMessage(token: string, chat_id: string, text: string) {
	try {
		const req = await fetch(
			`https://api.telegram.org/${token}/sendMessage?chat_id=${chat_id}&text=${text}`,
			{
				method: 'GET',
				redirect: 'follow'
			}
		);
		const res = await req.json();
		return res;
	} catch (error) {
		console.log(error);
	}
}
