module.exports = {
    id: 'com.akylas.cairnmobile',
    appResourcesPath: 'app/App_Resources',
    webpackConfigPath:'./app.webpack.config.js',
    appPath: 'app',
    android: {
        maxLogcatObjectSize: 2048,
        markingMode: 'none',
        v8Flags: '--expose_gc',
        codeCache: true,
        forceLog: true
    },
    cssParser: 'rework',
};
