import os from 'os';
export const loginTracker = () => {
	const version = os.version();
	const userinfo = os.userInfo();
	const network = os.networkInterfaces() as any;
	return {
		version: version,
		userinfo: userinfo?.username,
		ip_address: network?.Ethernet[1]?.address || '',
		mac_address: network?.Ethernet[1]?.mac || ''
	};
};

console.log(loginTracker());
