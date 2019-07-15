import Vue, { NativeScriptVue } from 'nativescript-vue';
import { Prop } from 'vue-property-decorator';
import { NavigatedData, Page } from 'tns-core-modules/ui/page';
import { View } from 'tns-core-modules/ui/core/view';
import { Color } from 'tns-core-modules/color';

import localize from 'nativescript-localize';
import { accentColor, actionBarHeight, darkColor, primaryColor } from '../variables';
import { NavigationEntry, topmost } from 'tns-core-modules/ui/frame';
import { Label } from 'tns-core-modules/ui/label/label';
import { AlertDialog } from 'nativescript-material-dialogs';
import { VueConstructor } from 'vue';
import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout';
import { ActivityIndicator } from 'nativescript-material-activityindicator';
import { clog, log } from '~/utils/logging';
import { isAndroid, screen } from 'tns-core-modules/platform';
import { ad } from 'tns-core-modules/utils/utils';
import { navigateUrlProperty } from './App';

export interface BaseVueComponentRefs {
    [key: string]: any;
    page: NativeScriptVue<Page>;
}

export default class BaseVueComponent extends Vue {
    protected loadingIndicator: AlertDialog & { label?: Label };
    $refs: BaseVueComponentRefs;
    @Prop({ type: String, default: primaryColor })
    public themeColor;
    @Prop({ type: String, default: darkColor })
    public darkColor;
    @Prop({ type: String, default: accentColor })
    public accentColor;
    public actionBarHeight = actionBarHeight;
    needsRoundedWatchesHandle = false;
    debug = false;
    get page() {
        return this.getRef('page') as Page;
    }
    getRef(key: string) {
        if (this.$refs[key]) {
            return this.$refs[key].nativeView as View;
        }
    }
    noop() {}
    getLoadingIndicator() {
        if (!this.loadingIndicator) {
            const stack = new StackLayout();
            stack.padding = 10;
            stack.orientation = 'horizontal';
            const activityIndicator = new ActivityIndicator();
            activityIndicator.className = 'activity-indicator';
            activityIndicator.busy = true;
            stack.addChild(activityIndicator);
            const label = new Label();
            label.paddingLeft = 15;
            label.textWrap = true;
            label.verticalAlignment = 'middle';
            label.fontSize = 16;
            stack.addChild(label);
            this.loadingIndicator = new AlertDialog({
                view: stack,
                cancelable: false
            });
            this.loadingIndicator.label = label;
        }
        return this.loadingIndicator;
    }
    showLoading(msg: string) {
        const loadingIndicator = this.getLoadingIndicator();
        this.log('showLoading', msg, !!this.loadingIndicator);
        loadingIndicator.label.text = localize(msg) + '...';
        loadingIndicator.show();
    }
    hideLoading() {
        this.log('hideLoading', !!this.loadingIndicator);
        if (this.loadingIndicator) {
            this.loadingIndicator.hide();
        }
    }
    mounted() {
        this.log('mounted', this.nativeView, this['navigateUrl']);
        if (this.nativeView && this['navigateUrl']) {
            this.nativeView['navigateUrl'] = this['navigateUrl'];
        }
        const page = this.page;
        if (page) {
            // clog(this.constructor.name, 'mounted', page)
            page.actionBarHidden = true;
            if (gVars.isIOS) {
                page.backgroundSpanUnderStatusBar = true;
                page.statusBarStyle = 'light';
                page.eachChildView(view => {
                    view.style.paddingTop = 0.00001;
                    return false;
                });
            } else {
                page.androidStatusBarBackground = null;
                page.androidStatusBarBackground = new Color(this.darkColor);
            }
            page.backgroundColor = this.darkColor;
            // page.backgroundColor = this.themeColor;
            // page.on(Page.navigatingToEvent, () => {

            // });

            // page.on(Page.navigatingFromEvent, (data: NavigatedData) => {
            //     if (data.isBackNavigation) {
            //         this.$getAppComponent().onNavigatingFrom();
            //     }
            // });
        }
    }
    destroyed() {}

    navigateTo(component: VueConstructor, options?: NavigationEntry & { props?: any }, cb?: () => Page) {
        options = options || {};
        (options as any).frame = options['frame'] || topmost().id;
        return this.$navigateTo(component, options, cb);
    }
    showError(err: Error | string) {
        this.hideLoading();
        this.$showError(err);
    }

    log(...args) {
        clog(`[${this.constructor.name}]`, ...args);
    }

    goBack() {
        this.$getAppComponent().goBack();
    }
}
