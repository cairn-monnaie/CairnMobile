import { Component, Prop } from 'vue-property-decorator';
import BaseVueComponent from './BaseVueComponent';
import { NavigationEntry, Page, topmost } from '@nativescript/core/ui/frame/frame';
import { VueConstructor } from 'vue';
import { actionBarButtonHeight, actionBarHeight, primaryColor } from '~/variables';

@Component({})
export default class CairnPage extends BaseVueComponent {
    @Prop({ default: null, type: String })
    public title: string;

    @Prop({ default: null, type: String })
    public subtitle: string;

    @Prop({ default: false, type: Boolean })
    public showMenuIcon: boolean;

    @Prop({ default: false, type: Boolean })
    public modal: boolean;

    @Prop({ default: false, type: Boolean })
    public actionBarHidden: boolean;

    @Prop({ default: true, type: Boolean })
    public bottomActionBarHidden: boolean;

    @Prop({ type: String })
    public mdiAction: string;

    @Prop({ type: String })
    public mdiActionClass: string;

    @Prop({ type: Number })
    public mdiActionFontSize: number;

    @Prop({ default: true, type: Boolean })
    public actionBarShowLogo: boolean;

    @Prop({ default: primaryColor, type: String })
    public actionBarBackroundColor: string;

    @Prop({ default: actionBarHeight, type: Number })
    public actionBarHeight: number;

    public actionBarButtonHeight = actionBarButtonHeight;

    @Prop({ type: Number })
    public actionBarElevation: number;

    public navigateUrl = null;
    public id = null;

    public loading = false;

    get page() {
        return this.getRef('page') as Page;
    }
    destroyed() {
        super.destroyed();
    }
    mounted() {
        if (this.nativeView && this.navigateUrl) {
            this.nativeView['navigateUrl'] = this.navigateUrl;
        }
        const page = this.page;
        // this.log('mounted', this.nativeView, this.navigateUrl, !!page);
        if (page) {
            page.actionBarHidden = true;
            // if (gVars.isIOS) {
            page.backgroundSpanUnderStatusBar = true;
            //     page.statusBarStyle = 'light';
            //     page.eachChildView(view => {
            //         view.style.paddingTop = 0.00001;
            //         return false;
            //     });
            // } else {
            //     page.androidStatusBarBackground = null;
            //     page.androidStatusBarBackground = new Color(this.darkColor);
            // }
            // page.backgroundColor = this.darkColor;
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
}
