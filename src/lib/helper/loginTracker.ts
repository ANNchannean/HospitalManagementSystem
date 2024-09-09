import os from 'os';

export const loginTracker = () => {
	const version = os.version();
	const userinfo = os.userInfo();
	const network = os.networkInterfaces() || undefined;
	const { address, mac } = network?.Ethernet[1];
	return {
		version: version,
		userinfo: userinfo?.username,
		ip_address: address,
		mac_address: mac 
	};
};

console.log(loginTracker());
