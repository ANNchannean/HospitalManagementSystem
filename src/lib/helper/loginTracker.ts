import os from 'os';
console.log(os.version());
function loginTracker() {
	const version = os.version();
	const userinfo = os.userInfo();
	const network = os.networkInterfaces()
	return {
		version: version,
		userinfo: userinfo,
		network: network
	};
}

console.log(loginTracker());
