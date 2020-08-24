import { View } from '@nativescript/core/ui/core/view';
import { Frame } from '@nativescript/core/ui/frame';
import { Label } from '@nativescript/core/ui/label/label';
import { StackLayout } from '@nativescript/core/ui/layouts/stack-layout';
import { Page } from '@nativescript/core/ui/page';
import { $t } from '~/helpers/locale';
import { ActivityIndicator } from 'nativescript-material-activityindicator';
import { AlertDialog } from 'nativescript-material-dialogs';
import Vue, { NativeScriptVue, NavigationEntryVue } from 'nativescript-vue';
import { VueConstructor } from 'vue';
import { Prop } from 'vue-property-decorator';
import { clog } from '~/utils/logging';
import { accentColor, cairnFontFamily, darkColor, primaryColor } from '../variables';
import { bind } from 'helpful-decorators';
import InAppBrowser from 'nativescript-inappbrowser';
import { openUrl } from '@nativescript/core/utils/utils';

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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
    public cairnFontFamily = cairnFontFamily;
    needsRoundedWatchesHandle = false;
    debug = false;
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
    showLoadingStartTime: number = null;
    showLoading(msg: string) {
        const loadingIndicator = this.getLoadingIndicator();
        // this.log('showLoading', msg, !!this.loadingIndicator);
        loadingIndicator.label.text = $t(msg) + '...';
        this.showLoadingStartTime = Date.now();
        loadingIndicator.show();
    }
    hideLoading() {
        const delta = this.showLoadingStartTime ? Date.now() - this.showLoadingStartTime : -1;
        if (delta >= 0 && delta < 1000) {
            setTimeout(() => this.hideLoading(), 1000 - delta);
            return;
        }
        // this.log('hideLoading', !!this.loadingIndicator);
        if (this.loadingIndicator) {
            this.loadingIndicator.hide();
        }
    }
    mounted() {}
    destroyed() {
        this.log('destroyed');
    }

    navigateTo(component: VueConstructor, options?: NavigationEntryVue, cb?: () => Page) {
        options = options || {};
        (options as any).frame = options['frame'] || Frame.topmost().id;
        return this.$navigateTo(component, options, cb);
    }
    @bind
    async showError(err: Error | string) {
        return this.showErrorInternal(err);
    }
    async showErrorInternal(err: Error | string) {
        const delta = this.showLoadingStartTime ? Date.now() - this.showLoadingStartTime : -1;
        if (delta >= 0 && delta < 1000) {
            await timeout(1000 - delta);
            return this.showErrorInternal(err);
        }
        this.hideLoading();
        return this.$crashReportService.showError(err);
    }

    log(...args) {
        clog(`[${this.constructor.name}]`, ...args);
    }

    goBack() {
        this.$getAppComponent().goBack();
    }
    async openLink(url: string) {
        try {
            const available = await InAppBrowser.isAvailable();
            if (available) {
                const result = await InAppBrowser.open(url, {
                    // iOS Properties
                    dismissButtonStyle: 'close',
                    preferredBarTintColor: primaryColor,
                    preferredControlTintColor: 'white',
                    readerMode: false,
                    animated: true,
                    // modalPresentationStyle: 'fullScreen',
                    // modalTransitionStyle: 'partialCurl',
                    // modalEnabled: true,
                    enableBarCollapsing: false,
                    // Android Properties
                    showTitle: true,
                    toolbarColor: primaryColor,
                    secondaryToolbarColor: 'white',
                    enableUrlBarHiding: true,
                    enableDefaultShare: true,
                    forceCloseOnRedirection: false
                    // Specify full animation resource identifier(package:anim/name)
                    // or only resource name(in case of animation bundled with app).
                    // animations: {
                    //     startEnter: 'slide_in_right',
                    //     startExit: 'slide_out_left',
                    //     endEnter: 'slide_in_left',
                    //     endExit: 'slide_out_right'
                    // },
                    // headers: {
                    //     'my-custom-header': 'my custom header value'
                    // }
                });
                // alert({
                //     title: 'Response',
                //     message: JSON.stringify(result),
                //     okButtonText: 'Ok'
                // });
            } else {
                openUrl(url);
            }
        } catch (error) {
            alert({
                title: 'Error',
                message: error.message,
                okButtonText: 'Ok'
            });
        }
    }
}
