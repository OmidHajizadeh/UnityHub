module.exports = {
	globDirectory: 'public/',
	globPatterns: [
		'**/*.{html,svg,png,webp,json,js,xml,ts}'
	],
	swDest: 'public/service-worker.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};