module.exports = {
	apps: [
		{
			name: 'server',
			script: 'server.js',
			node_args: '-r dotenv/config'
		}
	]
};
