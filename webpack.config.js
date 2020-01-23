const WebpackTemplate = require('nativescript-akylas-webpack-template');
const { resolve } = require('path');
const { readFileSync } = require('fs');
const { BugsnagSourceMapUploaderPlugin } = require('webpack-bugsnag-plugins');

const NsVueTemplateCompiler = require('nativescript-vue-template-compiler');
// returns a new object with the values at each key mapped using mapFn(value)

// temporary hack to support v-model using ns-vue-template-compiler
// See https://github.com/nativescript-vue/nativescript-vue/issues/371
NsVueTemplateCompiler.registerElement('MDTextField', () => require('nativescript-material-textfield').TextField, {
    model: {
        prop: 'text',
        event: 'textChange'
    }
});
NsVueTemplateCompiler.registerElement('MDSlider', () => require('nativescript-material-slider').Slider, {
    model: {
        prop: 'value',
        event: 'valueChange'
    }
});

module.exports = env => {
    const platform = env && ((env.android && 'android') || (env.ios && 'ios'));
    const appComponents = [];
    if (platform === 'android') {
        appComponents.push(resolve(__dirname, 'app/receivers/SmsReceiver'));
    }
    const {
        // development = false,
        // uglify,
        production, // --env.production
        // sourceMap, // --env.sourceMap
        devlog, // --env.loglevel
        adhoc // --env.adhoc
    } = env;
    if (adhoc) {
        env = Object.assign({}, env, {
            production: true,
            sourceMap: true,
            uglify: true
        });
    }
    const BUGSNAG_KEY = 'd85d1a07697803385200b8d955e42236';

    const config = WebpackTemplate(env, {
        projectRoot: __dirname,
        appComponents,
        snapshotPlugin: {
            useLibs: true,
            targetArchs: ['arm', 'arm64', 'ia32']
        },
        alias: {
            'nativescript-vue': 'nativescript-akylas-vue',
            vue: 'nativescript-vue'
        },
        copyPlugin: [
            { from: resolve(__dirname, 'node_modules/@mdi/font/fonts/materialdesignicons-webfont.ttf'), to: 'fonts' },
            { from: resolve(__dirname, 'node_modules/@mdi/font/css/materialdesignicons.min.css'), to: 'assets' }
        ],
        definePlugin: {
            PRODUCTION: !!production,
            LOG_LEVEL: !!devlog ? '"full"' : '""',
            TEST_LOGS: adhoc || !production,
            'gVars.BUGSNAG_KEY': `"${BUGSNAG_KEY}"`
        }
    });

    if (!!production) {
        let appVersion;
        let buildNumber;
        if (platform === 'android') {
            appVersion = readFileSync('app/App_Resources/Android/app.gradle', 'utf8').match(/versionName "((?:[0-9]+\.?)+)"/)[1];
            buildNumber = readFileSync('app/App_Resources/Android/app.gradle', 'utf8').match(/versionCode ([0-9]+)/)[1];
        } else if (platform === 'ios') {
            appVersion = readFileSync('app/App_Resources/iOS/Info.plist', 'utf8').match(/<key>CFBundleShortVersionString<\/key>[\s\n]*<string>(.*?)<\/string>/)[1];
            buildNumber = readFileSync('app/App_Resources/iOS/Info.plist', 'utf8').match(/<key>CFBundleVersion<\/key>[\s\n]*<string>([0-9]*)<\/string>/)[1];
        }
        if (buildNumber) {
            appVersion += `.${buildNumber}`;
        }
        appVersion += `${platform === 'android' ? 1 : 0}`;
        console.log('appVersion', appVersion, buildNumber);
        config.plugins.push(
            new BugsnagSourceMapUploaderPlugin({
                apiKey: BUGSNAG_KEY,
                appVersion,
                overwrite: true,
                publicPath: '.'
            })
        );
    }
    return config;
};
