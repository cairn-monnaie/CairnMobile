import * as EInfo from 'nativescript-extendedinfo';
import Vue, { NativeScriptVue } from 'nativescript-vue';
import { device, screen } from 'tns-core-modules/platform';
import { NavigationEntry } from 'tns-core-modules/ui/frame';
import { Color } from 'tns-core-modules/color';
import { GridLayout } from 'tns-core-modules/ui/layouts/grid-layout';
import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout';
import { Page } from 'tns-core-modules/ui/page';
import { GC } from 'tns-core-modules/utils/utils';
import { Frame } from 'tns-core-modules/ui/frame/frame';
import { TabView } from 'tns-core-modules/ui/tab-view/tab-view';
import { VueConstructor } from 'vue';
import { Component } from 'vue-property-decorator';
import { setDrawerInstance } from '~/main';
import BaseVueComponent, { BaseVueComponentRefs } from './BaseVueComponent';
import Home from './Home';
import MultiDrawer, { OptionsType } from './MultiDrawer';
import Profile from './Profile';
import Login from './Login';
// import Map from './Map';
import AppFrame from './AppFrame';
import { LoggedinEvent, LoggedoutEvent } from '~/services/AuthService';
import * as app from 'application';
import { compose } from 'nativescript-email';
import { prompt } from 'nativescript-material-dialogs';

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
    Map = 'map'
}
// Settings = 'settings',
// Pairing = 'pairing',
// History = 'history',
// Map = 'map'
export const navigateUrlProperty = 'navigateUrl';

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
        console.log('drawerOptions', this.currentlyLoggedIn);
        if (this.currentlyLoggedIn) {
            return {
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
                    swipeOpenTriggerWidth: 10
                }
            }
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
        // [ComponentIds.Map]: {
        //     component: Map
        // }
    };
    selectedTabIndex: number = 0;
    public activatedUrl = '';
    public loggedInOnStart = Vue.prototype.$authService.isLoggedIn();
    public currentlyLoggedIn = Vue.prototype.$authService.isLoggedIn();

    public appVersion: string;
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
                icon: 'bank',
                url: ComponentIds.Situation
            },
            {
                title: 'profile',
                icon: 'account',
                url: ComponentIds.Profile
            },
            {
                title: 'map',
                icon: 'map',
                url: ComponentIds.Map
            }
        ];

        return result;
    }

    constructor() {
        super();
        this.log('loggedInOnStart', this.loggedInOnStart)
        // this.currentlyLoggedin = Vue.prototype.$authService.isLoggedIn();
        this.$setAppComponent(this);
        this.appVersion = EInfo.getVersionNameSync() + '.' + EInfo.getBuildNumberSync();
    }
    onLoaded() {
        GC();
    }
    destroyed() {
        super.destroyed();
    }
    mounted(): void {
        super.mounted();
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

        authService.on(LoggedinEvent, () => {
            this.currentlyLoggedIn = true;
            console.log('LoggedinEvent');
            this.navigateToUrl(ComponentIds.Situation, {
                // props: { autoConnect: false },
                clearHistory: true
            });
        });
        authService.on(LoggedoutEvent, () => {
            this.currentlyLoggedIn = false;
            console.log('LoggedoutEvent');
            this.goBackToLogin();
        });
    }
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
        this.log('setActivatedUrl', id);
        this.handleSetActivatedUrl(id);
    }
    navigateBack(backEntry?) {
        this.innerFrame && this.innerFrame.goBack(backEntry);
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
        this.log('onNavItemTap', url);
        // this.navigateToUrl(url as any);
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
                                            widthDIPs: screen.mainScreen.widthDIPs,
                                            heightDIPs: screen.mainScreen.heightDIPs,
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
                }).catch(this.$showError);
                break;
            case 'sendBugReport':
                prompt({
                    message: this.$ltc('send_bug_report'),
                    okButtonText: this.$t('send'),
                    cancelButtonText: this.$t('cancel'),
                    autoFocus: true,
                    textFieldProperties: {
                        marginLeft: 10,
                        marginRight: 10,
                        hint: this.$ltc('please_describe_error')
                    }
                } as any).then(result => {
                    if (result.result && this.$bugsnag) {
                        this.$bugsnag
                            .notify({
                                error: new Error('bug_report_error'),
                                metadata: {
                                    report: {
                                        message: result.text
                                    }
                                }
                            })
                            .then(() => {
                                this.$alert('bug_report_sent');
                            })
                            .catch(this.$showError);
                    }
                });
                break;
                case 'logout':{
                    this.$authService.logout();
                }
        }
    }

    navigateTo(component: VueConstructor, options?: NavigationEntry & { props?: any }, cb?: () => Page) {
        options = options || {};
        // options.transition = options.transition || {
        //     name: 'fade',
        //     duration: 200,
        //     curve: 'easeIn'
        // },
        (options as any).frame = options['frame'] || this.innerFrame.id;
        return super.navigateTo(component, options, cb);
    }
    navigateToUrl(url: ComponentIds, options?: NavigationEntry & { props?: any }, cb?: () => Page) {
        console.log('navigateToUrl', url, this.activatedUrl, this.routes[url]);
        if (this.isActiveUrl(url) || !this.routes[url]) {
            return;
        }
        // options = options || {};
        // options.props = options.props || {};
        // options.props[navigateUrlProperty] = url;
        console.log('navigateToUrl', url);
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
