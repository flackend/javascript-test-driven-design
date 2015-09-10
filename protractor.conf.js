exports.config = {
    framework: 'jasmine2',
    specs: ['test/e2e/**/*.js'],
    directConnect: true,
    capabilities: {
        browserName: 'chrome',
        shardTestFiles: true,
        maxInstances: 5
    },
    baseUrl: 'http://localhost:3333'
};