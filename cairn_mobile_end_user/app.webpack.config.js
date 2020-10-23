const NsVueTemplateCompiler = require('nativescript-vue-template-compiler');
NsVueTemplateCompiler.registerElement('MDTextField', () => require('@nativescript-community/ui-material-textfield').TextField, {
    model: {
        prop: 'text',
        event: 'textChange'
    }
});
NsVueTemplateCompiler.registerElement('MDSlider', () => require('@nativescript-community/ui-material-slider').Slider, {
    model: {
        prop: 'value',
        event: 'valueChange'
    }
});
NsVueTemplateCompiler.registerElement('Pager', () => require('@nativescript-community/ui-pager').Pager, {
    model: {
        prop: 'selectedIndex',
        event: 'selectedIndexChange'
    }
});
const webpackConfig = require('./webpack.config.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const { readFileSync } = require('fs');
const { dirname, join, relative, resolve, sep } = require('path');
const nsWebpack = require('@nativescript/webpack');
const CopyPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const SentryCliPlugin = require('@sentry/webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, params = {}) => {
    if (env.adhoc) {
        Object.assign(env, {
            production: true,
            // sentry: true,
            sourceMap: true,
            uglify: true
        });
    }
    const nconfig = require('./nativescript.config');
    const {
        appPath = nconfig.appPath,
        appResourcesPath = nconfig.appResourcesPath,
        hmr, // --env.hmr
        production, // --env.production
        sourceMap, // --env.sourceMap
        hiddenSourceMap, // --env.hiddenSourceMap
        inlineSourceMap, // --env.inlineSourceMap
        sentry, // --env.sentry
        uploadSentry = true,
        verbose, // --env.verbose
        uglify, // --env.uglify
        noconsole, // --env.noconsole
        devlog, // --env.devlog
        fakeall, // --env.fakeall
        adhoc // --env.adhoc
    } = env;

    const platform = env && ((env.android && 'android') || (env.ios && 'ios'));
    const mode = production ? 'production' : 'development';
    const tsconfig = 'tsconfig.json';
    const projectRoot = params.projectRoot || __dirname;
    const dist = resolve(projectRoot, nsWebpack.getAppPath(platform, projectRoot));
    const appResourcesFullPath = resolve(projectRoot, appResourcesPath);

    if (platform === 'android') {
        // env.appComponents = [resolve(projectRoot, 'app/common/services/android/BgService.ts'), resolve(projectRoot, 'app/common/services/android/BgServiceBinder.ts')];
    }
    const config = webpackConfig(env, params);
    const coreModulesPackageName = '@akylas/nativescript';
    config.resolve.modules = [resolve(__dirname, `node_modules/${coreModulesPackageName}`), resolve(__dirname, 'node_modules'), `node_modules/${coreModulesPackageName}`, 'node_modules'];
    Object.assign(config.resolve.alias, {
        '@nativescript/core': `${coreModulesPackageName}`,
        'tns-core-modules': `${coreModulesPackageName}`,
        '../driver/oracle/OracleDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        './oracle/OracleDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        '../driver/cockroachdb/CockroachDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        './cockroachdb/CockroachDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        './cordova/CordovaDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        './react-native/ReactNativeDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        '../driver/react-native/ReactNativeDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        './nativescript/NativescriptDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        '../driver/nativescript/NativescriptDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        './mysql/MysqlDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        '../driver/mysql/MysqlDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        './postgres/PostgresDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        '../driver/postgres/PostgresDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        './expo/ExpoDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        './aurora-data-api/AuroraDataApiDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        '../driver/aurora-data-api/AuroraDataApiDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        './sqlite/SqliteDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        '../driver/sqljs/SqljsDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        './sqljs/SqljsDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        '../driver/sqlserver/SqlServerDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        './sqlserver/SqlServerDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        './mongodb/MongoDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        '../driver/mongodb/MongoDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        './cordova/CordovaDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver',
        '../driver/cordova/CordovaDriver': '@akylas/nativescript-sqlite/typeorm/NativescriptDriver'
    });

    const package = require('./package.json');
    const nsconfig = require('./nativescript.config.js');
    const isIOS = platform === 'ios';
    const isAndroid = platform === 'android';
    const APP_STORE_ID = process.env.IOS_APP_ID;
    const CUSTOM_URL_SCHEME = 'ecairn';
    const CAIRN_TRANSFER_QRCODE = 'transfer';
    const CAIRN_TRANSFER_QRCODE_PARAMS = '%(ICC)s#%(id)s#%(name)s';
    const CAIRN_TRANSFER_QRCODE_AMOUNT_PARAM = '#%(amount)s';
    const defines = {
        PRODUCTION: !!production,
        process: 'global.process',
        'global.TNS_WEBPACK': 'true',
        'gVars.platform': `"${platform}"`,
        'global.isIOS': isIOS,
        'global.isAndroid': isAndroid,
        'gVars.internalApp': false,
        TNS_ENV: JSON.stringify(mode),
        'gVars.sentry': !!sentry,
        SENTRY_DSN: `"${process.env.SENTRY_DSN}"`,
        CAIRN_URL: `"${process.env.CAIRN_URL}"`,
        CAIRN_CLIENT_ID: `"${process.env.CAIRN_CLIENT_ID}"`,
        CAIRN_CLIENT_SECRET: `"${process.env.CAIRN_CLIENT_SECRET}"`,
        CAIRN_SMS_NUMBER: `"${process.env.CAIRN_SMS_NUMBER}"`,
        SHA_SECRET_KEY: `"${process.env.CAIRN_SHA_SECRET_KEY}"`,
        SENTRY_PREFIX: `"${!!sentry ? process.env.SENTRY_PREFIX : ''}"`,
        GIT_URL: `"${package.repository}"`,
        SUPPORT_URL: `"${package.bugs.url}"`,
        TERMS_CONDITIONS_URL: `"${process.env.TERMS_CONDITIONS_URL}"`,
        PRIVACY_POLICY_URL: `"${process.env.PRIVACY_POLICY_URL}"`,
        CUSTOM_URL_SCHEME: `"${CUSTOM_URL_SCHEME}"`,
        CAIRN_TRANSFER_QRCODE: `"${CAIRN_TRANSFER_QRCODE}"`,
        CAIRN_TRANSFER_QRCODE_PARAMS: `"${CAIRN_TRANSFER_QRCODE_PARAMS}"`,
        CAIRN_TRANSFER_QRCODE_AMOUNT_PARAM: `"${CAIRN_TRANSFER_QRCODE_AMOUNT_PARAM}"`,
        CAIRN_FULL_QRCODE_FORMAT: `"${`${CUSTOM_URL_SCHEME}://${CAIRN_TRANSFER_QRCODE}/${CAIRN_TRANSFER_QRCODE_PARAMS}`}"`,
        CREDIT_URL: '"https://www.helloasso.com/associations/le-cairn-monnaie-locale-et-citoyenne/formulaires/3"',
        STORE_LINK: `"${isAndroid ? `https://play.google.com/store/apps/details?id=${nsconfig.id}` : `https://itunes.apple.com/app/id${APP_STORE_ID}`}"`,
        STORE_REVIEW_LINK: `"${
            isIOS
                ? ` itms-apps://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?id=${APP_STORE_ID}&onlyLatestVersion=true&pageNumber=0&sortOrdering=1&type=Purple+Software`
                : `market://details?id=${nsconfig.id}`
        }"`,
        LOG_LEVEL: devlog ? '"full"' : '""',
        FAKE_ALL: fakeall,
        TEST_LOGS: adhoc || !production,
        WITH_PUSH_NOTIFICATIONS: 'true'
    };

    const itemsToClean = [`${dist}/**/*`];
    if (platform === 'android') {
        itemsToClean.push(`${join(projectRoot, 'platforms', 'android', 'app', 'src', 'main', 'assets', 'snapshots/**/*')}`);
        itemsToClean.push(`${join(projectRoot, 'platforms', 'android', 'app', 'build', 'configurations', 'nativescript-android-snapshot')}`);
    }

    const symbolsParser = require('scss-symbols-parser');
    const mdiSymbols = symbolsParser.parseSymbols(readFileSync(resolve(projectRoot, 'node_modules/@mdi/font/scss/_variables.scss')).toString());
    const mdiIcons = JSON.parse(`{${mdiSymbols.variables[mdiSymbols.variables.length - 1].value.replace(/" (F|0)(.*?)([,\n]|$)/g, '": "$1$2"$3')}}`);

    const cairnSymbols = symbolsParser.parseSymbols(readFileSync(resolve(projectRoot, 'css/cairn.scss')).toString());
    const cairnIcons = JSON.parse(`{${cairnSymbols.variables[cairnSymbols.variables.length - 1].value.replace(/'cairn-([a-zA-Z0-9-_]+)' (F|f|e|0)(.*?)([,\n]+|$)/g, '"$1": "$2$3"$4')}}`);
    const scssPrepend = `$lato-fontFamily: ${platform === 'android' ? 'res/lato' : 'Lato'};
    $cairn-fontFamily: ${platform === 'android' ? 'cairn' : 'cairn'};
    $mdi-fontFamily: ${platform === 'android' ? 'materialdesignicons-webfont' : 'Material Design Icons'};`;

    config.module.rules.forEach(r => {
        if (Array.isArray(r.use) && r.use.indexOf('sass-loader') !== -1) {
            r.use.splice(-1, 1, {
                loader: 'sass-loader',
                options: {
                    sourceMap: false,
                    additionalData: scssPrepend
                }
            });
        }
    });
    const indexOfTsLoaderRule = config.module.rules.findIndex(r => r.loader === 'ts-loader');
    config.module.rules[indexOfTsLoaderRule].options.transpileOnly = true;
    config.module.rules[indexOfTsLoaderRule].options.configFile = resolve(__dirname, 'tsconfig.json');

    config.module.rules.push({
        // rules to replace mdi icons and not use nativescript-font-icon
        test: /\.(ts|js|scss|css|vue)$/,
        exclude: /node_modules/,
        use: [
            {
                loader: 'string-replace-loader',
                options: {
                    search: 'mdi-([a-z-]+)',
                    replace: (match, p1, offset, str) => {
                        if (mdiIcons[p1]) {
                            return String.fromCharCode(parseInt(mdiIcons[p1], 16));
                        }
                        return match;
                    },
                    flags: 'g'
                }
            },
            {
                loader: 'string-replace-loader',
                options: {
                    search: 'cairn-([a-zA-Z0-9-_]+)',
                    replace: (match, p1, offset) => {
                        if (cairnIcons[p1]) {
                            return String.fromCharCode(parseInt(cairnIcons[p1], 16));
                        }
                        return match;
                    },
                    flags: 'g'
                }
            }
        ]
    });

    // we remove default rules
    // we remove default rules
    config.plugins = config.plugins.filter(p => ['DefinePlugin', 'CleanWebpackPlugin', 'CopyPlugin'].indexOf(p.constructor.name) === -1);
    // we add our rules
    const copyIgnore = { ignore: [`**/${relative(appPath, appResourcesFullPath)}/**`] };
    config.plugins.unshift(
        new CopyPlugin(
            [
                { from: 'fonts/!(ios|android)/**/*', to: 'fonts', flatten: true, dot: false },
                { from: 'fonts/*', to: 'fonts', flatten: true, dot: false },
                { from: `fonts/${platform}/**/*`, to: 'fonts', flatten: true, dot: false },
                { from: '**/*.jpg', dot: false },
                { from: '**/*.png', dot: false },
                { from: 'assets/**/*', dot: false },
                {
                    from: '../node_modules/@mdi/font/fonts/materialdesignicons-webfont.ttf',
                    to: 'fonts',
                    noErrorOnMissing: true,
                    globOptions: { dot: false, ...copyIgnore }
                }
            ],
            copyIgnore
        )
    );

    config.plugins.unshift(
        new CleanWebpackPlugin({
            dangerouslyAllowCleanPatternsOutsideProject: true,
            dry: false,
            verbose: false,
            cleanOnceBeforeBuildPatterns: itemsToClean
        })
    );
    config.plugins.unshift(new webpack.DefinePlugin(defines));
    config.plugins.push(
        new webpack.EnvironmentPlugin({
            NODE_ENV: JSON.stringify(mode), // use 'development' unless process.env.NODE_ENV is defined
            DEBUG: false
        })
    );

    config.devtool = inlineSourceMap ? 'inline-cheap-source-map' : false;
    if (hiddenSourceMap || sourceMap) {
        if (!!sentry && !!uploadSentry) {
            config.plugins.push(
                new webpack.SourceMapDevToolPlugin({
                    append: `\n//# sourceMappingURL=${process.env.SENTRY_PREFIX}[name].js.map`,
                    filename: join(process.env.SOURCEMAP_REL_DIR, '[name].js.map')
                })
            );
            let appVersion;
            let buildNumber;
            if (platform === 'android') {
                appVersion = readFileSync('app/App_Resources/Android/app.gradle', 'utf8').match(/versionName "((?:[0-9]+\.?)+)"/)[1];
                buildNumber = readFileSync('app/App_Resources/Android/app.gradle', 'utf8').match(/versionCode ([0-9]+)/)[1];
            } else if (platform === 'ios') {
                appVersion = readFileSync('app/App_Resources/iOS/Info.plist', 'utf8').match(/<key>CFBundleShortVersionString<\/key>[\s\n]*<string>(.*?)<\/string>/)[1];
                buildNumber = readFileSync('app/App_Resources/iOS/Info.plist', 'utf8').match(/<key>CFBundleVersion<\/key>[\s\n]*<string>([0-9]*)<\/string>/)[1];
            }
            console.log('appVersion', appVersion, buildNumber);

            config.plugins.push(
                new SentryCliPlugin({
                    release: appVersion,
                    urlPrefix: 'app:///',
                    rewrite: true,
                    dist: `${buildNumber}.${platform}`,
                    ignore: ['tns-java-classes', 'hot-update'],
                    include: [dist, join(dist, process.env.SOURCEMAP_REL_DIR)]
                })
            );
        } else {
            config.plugins.push(
                new webpack.SourceMapDevToolPlugin({
                    noSources: true
                })
            );
        }
    }
    if (!!production) {
        config.plugins.push(
            new ForkTsCheckerWebpackPlugin({
                async: false,
                typescript: {
                    configFile: resolve(tsconfig)
                }
            })
        );
    }
    config.optimization.minimize = uglify !== undefined ? uglify : production;
    const isAnySourceMapEnabled = !!sourceMap || !!hiddenSourceMap || !!inlineSourceMap;
    config.optimization.minimizer = [
        new TerserPlugin({
            parallel: true,
            cache: true,
            sourceMap: isAnySourceMapEnabled,
            terserOptions: {
                ecma: 6,
                // warnings: true,
                // toplevel: true,
                output: {
                    comments: false,
                    semicolons: !isAnySourceMapEnabled
                },
                compress: {
                    // The Android SBG has problems parsing the output
                    // when these options are enabled
                    collapse_vars: platform !== 'android',
                    sequences: platform !== 'android',
                    passes: 2,
                    drop_console: production && adhoc !== true
                },
                keep_fnames: true
            }
        })
    ];
    return config;
};
