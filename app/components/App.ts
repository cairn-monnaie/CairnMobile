import * as application from '@nativescript/core/application';
import { Color } from '@nativescript/core/color';
import { device, screen } from '@nativescript/core/platform';
import { NavigationEntry } from '@nativescript/core/ui/frame';
import { Frame } from '@nativescript/core/ui/frame/frame';
import { GridLayout } from '@nativescript/core/ui/layouts/grid-layout';
import { StackLayout } from '@nativescript/core/ui/layouts/stack-layout';
import { Page } from '@nativescript/core/ui/page';
import { TabView } from '@nativescript/core/ui/tab-view/tab-view';
import { GC } from '@nativescript/core/utils/utils';
import { compose } from 'nativescript-email';
import * as EInfo from 'nativescript-extendedinfo';
import { login } from 'nativescript-material-dialogs';
import { showSnack } from 'nativescript-material-snackbar';
import { TextField } from 'nativescript-material-textfield';
import * as perms from 'nativescript-perms';
import { Vibrate } from 'nativescript-vibrate';
import Vue, { NativeScriptVue } from 'nativescript-vue';
import { VueConstructor } from 'vue';
import { Component } from 'vue-property-decorator';
import { setDrawerInstance } from '~/main';
import { LoggedinEvent, LoggedoutEvent, UserProfile } from '~/services/AuthService';
import { screenHeightDips, screenWidthDips } from '~/variables';
// import Map from './Map';
import AppFrame from './AppFrame';
import BaseVueComponent, { BaseVueComponentRefs } from './BaseVueComponent';
import Beneficiaries from './Beneficiaries';
import Home from './Home';
import Login from './Login';
import Map from './Map';
import MultiDrawer from './MultiDrawer';
import Profile from './Profile';

function fromFontIcon(name: string, style, textColor: string, size: { width: number; height: number }, backgroundColor: string = null, borderWidth: number = 0, borderColor: string = null) {
    const fontAspectRatio = 1.28571429;
    // Prevent application crash when passing size where width or height is set equal to or less than zero, by clipping width and height to a minimum of 1 pixel.
    if (size.width <= 0) {
        size.width = 1;
    }
    if (size.height <= 0) {
        size.height = 1;
    }

    const paragraph = NSMutableParagraphStyle.new();
    paragraph.alignment = NSTextAlignment.Center;

    const fontSize = Math.min(size.width / fontAspectRatio, size.height);

    // stroke width expects a whole number percentage of the font size
    const strokeWidth = fontSize === 0 ? 0 : (-100 * borderWidth) / fontSize;

    const attributedString = NSAttributedString.alloc().initWithStringAttributes(
        name,
        NSDictionary.dictionaryWithDictionary({
            [NSFontAttributeName]: null,
            [NSForegroundColorAttributeName]: textColor ? new Color(textColor).ios : null,
            [NSBackgroundColorAttributeName]: backgroundColor ? new Color(backgroundColor).ios : null,
            [NSParagraphStyleAttributeName]: paragraph,
            [NSStrokeWidthAttributeName]: strokeWidth,
            [NSStrokeColorAttributeName]: borderColor ? new Color(borderColor).ios : null
        } as any)
    );

    UIGraphicsBeginImageContextWithOptions(size, false, 0.0);
    attributedString.drawInRect(CGRectMake(0, (size.height - fontSize) / 2, size.width, fontSize));
    const image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return image;
}

function base64Encode(value) {
    if (gVars.isIOS) {
        const text = NSString.stringWithString(value);
        const data = text.dataUsingEncoding(NSUTF8StringEncoding);
        return data.base64EncodedStringWithOptions(0);
    }
    if (gVars.isAndroid) {
        const text = new java.lang.String(value);
        const data = text.getBytes('UTF-8');
        return android.util.Base64.encodeToString(data, android.util.Base64.DEFAULT);
    }
}
export interface AppRefs extends BaseVueComponentRefs {
    [key: string]: any;
    innerFrame: NativeScriptVue<Frame>;
    menu: NativeScriptVue<StackLayout>;
    drawer: MultiDrawer;
}

export enum ComponentIds {
    Login = 'login',
    Situation = 'situation',
    Profile = 'profile',
    Transfer = 'transfer',
    Map = 'map',
    Beneficiaries = 'beneficiaries'
}
// Settings = 'settings',
// Pairing = 'pairing',
// History = 'history',
// Map = 'map'
export const navigateUrlProperty = 'navigateUrl';

const mailRegexp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

@Component({
    components: {
        Home,
        Login,
        Profile,
        MultiDrawer,
        AppFrame
    }
})
export default class App extends BaseVueComponent {
    $refs: AppRefs;
    // drawerOptions: OptionsType = {
    //     // top: {
    //     //     height: '100%',
    //     //     animation: {
    //     //         openDuration: 150,
    //     //         closeDuration: 150
    //     //     },
    //     //     swipeOpenTriggerHeight: 30,
    //     //     swipeOpenTriggerMinDrag: 20,
    //     //     swipeCloseTriggerMinDrag: 30
    //     // }
    //     left: {
    //         swipeOpenTriggerWidth: 5
    //     }
    // };

    get drawerOptions() {
        if (this.currentlyLoggedIn) {
            return {
                // debug:true,
                // top: {
                //     height: '100%',
                //     animation: {
                //         openDuration: 150,
                //         closeDuration: 150
                //     },
                //     swipeOpenTriggerHeight: 30,
                //     swipeOpenTriggerMinDrag: 20,
                //     swipeCloseTriggerMinDrag: 30
                // }
                left: {
                    swipeOpenTriggerWidth: 20
                }
            };
        } else {
            return {
                left: {
                    swipeOpenTriggerWidth: 0
                }
            };
        }
    }
    protected routes: { [k: string]: { component: typeof Vue } } = {
        [ComponentIds.Situation]: {
            component: Home
        },
        // [ComponentIds.Settings]: {
        //     component: Settings
        // },
        [ComponentIds.Profile]: {
            component: Profile
        },
        [ComponentIds.Login]: {
            component: Login
        },
        [ComponentIds.Beneficiaries]: {
            component: Beneficiaries
        },
        [ComponentIds.Map]: {
            component: Map
        }
    };
    selectedTabIndex: number = 0;
    public activatedUrl = '';
    public loggedInOnStart = Vue.prototype.$authService.isLoggedIn();
    public currentlyLoggedIn = Vue.prototype.$authService.isLoggedIn();

    public appVersion: string;
    public userProfile: UserProfile = null;
    get drawer() {
        return this.$refs.drawer && this.$refs.drawer;
    }
    get innerFrame() {
        return this.$refs.innerFrame && this.$refs.innerFrame.nativeView;
    }
    get menuItems() {
        const result = [
            {
                title: 'situation',
                icon: 'mdi-bank',
                url: ComponentIds.Situation
            },
            {
                title: 'profile',
                icon: 'mdi-account',
                url: ComponentIds.Profile
            },
            {
                title: 'beneficiaries',
                icon: 'mdi-account-group',
                url: ComponentIds.Beneficiaries
            },
            {
                title: 'map',
                icon: 'mdi-map',
                url: ComponentIds.Map
            }
        ];

        return result;
    }

    constructor() {
        super();
        this.log('loggedInOnStart', this.loggedInOnStart, this.$authService.userProfile);
        // this.currentlyLoggedin = Vue.prototype.$authService.isLoggedIn();
        this.$setAppComponent(this);
        this.userProfile = this.$authService.userProfile || null;
        this.appVersion = EInfo.getVersionNameSync() + '.' + EInfo.getBuildNumberSync();
    }
    onLoaded() {
        GC();
    }
    destroyed() {
        super.destroyed();
        if (gVars.isAndroid) {
            application.android.unregisterBroadcastReceiver('com.akylas.cairnmobile.SMS_RECEIVED');
            if (this.mMessageReceiver) {
                androidx.localbroadcastmanager.content.LocalBroadcastManager.getInstance(application.android.context).unregisterReceiver(this.mMessageReceiver);
                this.mMessageReceiver = null;
            }
        }
    }
    mMessageReceiver: android.content.BroadcastReceiver;
    mounted(): void {
        super.mounted();
        if (gVars.isAndroid) {
            if (gVars.isAndroid) {
                perms
                    .request('receiveSms')
                    .then(() => {
                        // class BroadcastReceiver extends android.content.BroadcastReceiver {
                        //     private _onReceiveCallback: (context: android.content.Context, intent: android.content.Intent) => void;

                        //     constructor(onReceiveCallback: (context: android.content.Context, intent: android.content.Intent) => void) {
                        //         super();
                        //         this._onReceiveCallback = onReceiveCallback;

                        //         return global.__native(this);
                        //     }

                        //     public onReceive(context: android.content.Context, intent: android.content.Intent) {
                        //         console.log('onReceive', intent.getAction());
                        //         if (this._onReceiveCallback) {
                        //             this._onReceiveCallback(context, intent);
                        //         }
                        //     }
                        // }
                        // this.mMessageReceiver = new BroadcastReceiver((context: android.content.Context, intent: android.content.Intent) => {
                        //     const msg = intent.getStringExtra('message');
                        //     const sender = intent.getStringExtra('sender');
                        //     this.log('messageReceived', msg, sender);
                        //     showSnack({
                        //         message: this.$t('sms_received', msg, sender)
                        //     });
                        // });
                        // console.log('registerReceiver', 'com.akylas.cairnmobile.SMS_RECEIVED');
                        // androidx.localbroadcastmanager.content.LocalBroadcastManager.getInstance(application.android.context).registerReceiver(
                        //     this.mMessageReceiver,
                        //     new globalAndroid.content.IntentFilter('com.akylas.cairnmobile.SMS_RECEIVED')
                        // );
                        application.android.registerBroadcastReceiver('com.akylas.cairnmobile.SMS_RECEIVED', (context: android.content.Context, intent: android.content.Intent) => {
                            const msg = intent.getStringExtra('message');
                            const sender = intent.getStringExtra('sender');
                            // this.log('messageReceived', msg, sender);
                            // this.$authService.fakeSMSPayment(sender, msg).then(() => {
                            showSnack({
                                message: this.$t('sms_received', msg, sender)
                            });
                            new Vibrate().vibrate(1000);

                            // });
                        });
                    })
                    .catch(this.showError);
            }
        }
        // this.page.actionBarHidden = true;
        setDrawerInstance(this.drawer);

        // if (gVars.isIOS && app.ios.window.safeAreaInsets) {
        //     const bottomSafeArea: number = app.ios.window.safeAreaInsets.bottom;
        //     if (bottomSafeArea > 0) {
        //         app.addCss(`
        //           Button.button-bottom-nav { padding-bottom: ${bottomSafeArea} !important }
        //       `);
        //     }
        // }
        // this.activatedUrl = '/pairing';

        // this.router.events.subscribe((event: NavigationEnd) => {
        //     if (event instanceof NavigationEnd) {
        //         this.activatedUrl = event.urlAfterRedirects;
        //     }
        // });
        this.innerFrame.on(Page.navigatingToEvent, this.onPageNavigation, this);

        const authService = Vue.prototype.$authService;

        authService.on(LoggedinEvent, e => {
            this.currentlyLoggedIn = true;
            const profile = (this.userProfile = e.data as UserProfile);
            this.$sentry && this.$sentry.setExtra('profile', profile);
            console.log('LoggedinEvent', e.data);
            this.navigateToUrl(ComponentIds.Situation, {
                // props: { autoConnect: false },
                clearHistory: true
            });
        });
        authService.on(LoggedoutEvent, () => {
            this.$sentry && this.$sentry.setExtra('profile', null);
            this.currentlyLoggedIn = false;
            console.log('LoggedoutEvent');
            this.goBackToLogin();
        });
    }
    // onAppResume(args: ApplicationEventData) {
    //     this.appPaused = false;
    // }
    // onAppPause(args: ApplicationEventData) {
    //     this.appPaused = true;
    // }

    // onBottomNavigationTabSelected(e) {
    //     console.log("onTabSelected", e.newIndex, this.selectedTabIndex)
    //     this.selectedTabIndex = e.newIndex;
    // }
    // tabviewLoaded(args: EventData) {
    //     var tabview = <any>args.object
    //     if (this.$isAndroid) {
    //         var tabViewgrid = tabview._grid
    //         tabViewgrid.removeViewAt(0)
    //     } else if (this.$isIOS) {
    //         tabview._ios.tabBar.hidden = true
    //     }
    // }
    getTabView() {
        return this.getRef('tabView') as TabView;
    }
    // getCurrenFrame() {
    //     const tabView = this.getTabView();
    //     return tabView.items[tabView.selectedIndex].getViewById('frame');
    // }
    onNavigatingTo() {
        // this.$navigateTo(Login, {
        //         animated: false
        //     })
        // setTimeout(() =>
        //     this.$navigateBack(), 5000)
    }
    onPageNavigation(event) {
        this.log('onPageNavigation', event.entry.resolvedPage, event.entry.resolvedPage[navigateUrlProperty]);
        this.closeDrawer();
        this.setActivatedUrl(event.entry.resolvedPage[navigateUrlProperty]);
    }

    isComponentSelected(url: string) {
        // this.log('isComponentSelected', url, this.activatedUrl);
        return this.activatedUrl === url;
    }

    openDrawer() {
        this.drawer.open();
    }
    closeDrawer() {
        this.drawer && this.drawer.close();
    }
    onCloseDrawerTap() {
        this.closeDrawer();
    }
    onMenuIcon() {
        const canGoBack = this.canGoBack();
        // const canGoBack = this.innerFrame && this.innerFrame.canGoBack();

        if (canGoBack) {
            return this.navigateBack();
        } else {
            this.$emit('tapMenuIcon');
            // const drawer = getDrawerInstance();
            // if (drawer) {
            if (this.drawer.isSideOpened()) {
                this.drawer.close();
            } else {
                this.drawer.open();
            }
            // }
        }
    }
    canGoBack() {
        return this.innerFrame && this.innerFrame.canGoBack();
    }

    isActiveUrl(id) {
        // this.log('isActiveUrl', id, this.activatedUrl);
        return this.activatedUrl === id;
    }

    handleSetActivatedUrl(id) {
        this.$nextTick(() => {
            this.$refs.menu &&
                this.$refs.menu.nativeView.eachChildView((c: GridLayout) => {
                    c.notify({ eventName: 'activeChange', object: c });
                    c.eachChildView(c2 => {
                        if (c2.hasOwnProperty('active')) {
                            c2.notify({ eventName: 'activeChange', object: c });
                            return true;
                        }
                    });
                    return true;
                });
        });
    }
    // @log
    setActivatedUrl(id) {
        if (!id) {
            return;
        }
        this.activatedUrl = id;
        // this.log('setActivatedUrl', id);
        this.handleSetActivatedUrl(id);
    }
    navigateBack(backEntry?) {
        this.innerFrame && this.innerFrame.goBack(backEntry);
    }

    navigateBackIfUrl(url) {
        if (this.isActiveUrl(url)) {
            this.navigateBack();
        }
    }
    findNavigationUrlIndex(url) {
        return this.innerFrame.backStack.findIndex(b => b.resolvedPage[navigateUrlProperty] === url);
    }
    navigateBackToUrl(url) {
        const index = this.findNavigationUrlIndex(url);
        console.log('navigateBackToUrl', url, index);
        if (index === -1) {
            console.log(url, 'not in backstack');
            return;
        }
        this.navigateBack(this.innerFrame.backStack[index]);
    }
    navigateBackToRoot() {
        const stack = this.innerFrame.backStack;
        if (stack.length > 0) {
            this.innerFrame && this.innerFrame.goBack(stack[0]);
        }
    }
    onNavItemTap(url: string, comp?: any): void {
        // this.log('onNavItemTap', url);
        this.navigateToUrl(url as any);
        // });
    }
    onTap(command: string) {
        switch (command) {
            case 'sendFeedback':
                compose({
                    subject: `[${EInfo.getAppNameSync()}(${this.appVersion})] Feedback`,
                    to: ['martin@akylas.fr'],
                    attachments: [
                        {
                            fileName: 'report.json',
                            path: `base64://${base64Encode(
                                JSON.stringify(
                                    {
                                        device: {
                                            model: device.model,
                                            deviceType: device.deviceType,
                                            language: device.language,
                                            manufacturer: device.manufacturer,
                                            os: device.os,
                                            osVersion: device.osVersion,
                                            region: device.region,
                                            sdkVersion: device.sdkVersion,
                                            uuid: device.uuid
                                        },
                                        screen: {
                                            widthDIPs: screenWidthDips,
                                            heightDIPs: screenHeightDips,
                                            widthPixels: screen.mainScreen.widthPixels,
                                            heightPixels: screen.mainScreen.heightPixels,
                                            scale: screen.mainScreen.scale
                                        }
                                    },
                                    null,
                                    4
                                )
                            )}`,
                            mimeType: 'application/json'
                        }
                    ]
                }).catch(this.showError);
                break;
            case 'sendBugReport':
                login({
                    title: this.$tc('send_bug_report'),
                    message: this.$tc('send_bug_report_desc'),
                    okButtonText: this.$t('send'),
                    cancelButtonText: this.$t('cancel'),
                    autoFocus: true,
                    usernameTextFieldProperties: {
                        marginLeft: 10,
                        marginRight: 10,
                        autocapitalizationType: 'none',
                        keyboardType: 'email',
                        autocorrect: false,
                        error: this.$tc('email_required'),
                        hint: this.$tc('email')
                    },
                    passwordTextFieldProperties: {
                        marginLeft: 10,
                        marginRight: 10,
                        error: this.$tc('please_describe_error'),
                        secure: false,
                        hint: this.$tc('description')
                    },
                    beforeShow: (options, usernameTextField: TextField, passwordTextField: TextField) => {
                        usernameTextField.on('textChange', (e: any) => {
                            const text = e.value;
                            if (!text) {
                                usernameTextField.error = this.$tc('email_required');
                            } else if (!mailRegexp.test(text)) {
                                usernameTextField.error = this.$tc('non_valid_email');
                            } else {
                                usernameTextField.error = null;
                            }
                        });
                        passwordTextField.on('textChange', (e: any) => {
                            const text = e.value;
                            if (!text) {
                                passwordTextField.error = this.$tc('description_required');
                            } else {
                                passwordTextField.error = null;
                            }
                        });
                    }
                }).then(result => {
                    if (result.result && this.$sentry) {
                        if (!result.userName || !mailRegexp.test(result.userName)) {
                            this.showError(new Error(this.$tc('email_required')));
                            return;
                        }
                        if (!result.password || result.password.length === 0) {
                            this.showError(new Error(this.$tc('description_required')));
                            return;
                        }
                        this.$sentry.withScope(scope => {
                            scope.setUser({ email: result.userName });
                            this.$sentry.captureMessage(result.password);
                            this.$alert(this.$t('bug_report_sent'));
                        });
                    }
                });
                break;
            case 'logout': {
                this.$authService.logout();
            }
        }
    }

    navigateTo(component: VueConstructor, options?: NavigationEntry & { props?: any }, cb?: () => Page) {
        options = options || {};
        options.transition = options.transition || {
            name: 'fade',
            duration: 200,
            curve: 'easeIn'
        };
        (options as any).frame = options['frame'] || this.innerFrame.id;
        return super.navigateTo(component, options, cb);
    }
    navigateToUrl(url: ComponentIds, options?: NavigationEntry & { props?: any }, cb?: () => Page) {
        if (this.isActiveUrl(url) || !this.routes[url]) {
            return;
        }
        // options = options || {};
        // options.props = options.props || {};
        // options.props[navigateUrlProperty] = url;

        this.closeDrawer();
        // console.log('navigateToUrl', url);
        const index = this.findNavigationUrlIndex(url);
        if (index === -1) {
            this.navigateTo(this.routes[url].component, options);
        } else {
            this.navigateBackToUrl(url);
        }
    }
    goBackToLogin() {
        if (this.loadingIndicator) {
            this.loadingIndicator.hide();
        }
        this.navigateToUrl(ComponentIds.Login, {
            // props: { autoConnect: false },
            clearHistory: true
        });
    }
}
