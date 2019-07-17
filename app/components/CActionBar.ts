import Vue from 'nativescript-vue';
import { Frame, topmost } from 'tns-core-modules/ui/frame';
import { Component, Prop, Watch } from 'vue-property-decorator';
import BaseVueComponent from './BaseVueComponent';

@Component({})
export default class ActionBar extends BaseVueComponent {
    @Prop({
        default: null
    })
    public title: string;

    @Prop({ default: null })
    public subtitle: string;

    @Prop({ default: false })
    public showMenuIcon: boolean;

    // @Prop({ default: false })
    public canGoBack = false;


    @Prop({ default: true })
    public showLogo: boolean;

    get menuIcon() {
        if (this.canGoBack) {
            return this.$isIOS ? 'mdi-chevron-left' : 'mdi-arrow-left';
        }
        return 'mdi-menu';
    }
    get menuIconVisible() {
        return this.canGoBack || this.showMenuIcon;
    }
    get menuIconVisibility() {
        return this.menuIconVisible ? 'visible' : 'collapsed';
    }

    mounted() {
        // this.battery = this.glassesBattery;
        setTimeout(() => {
            this.canGoBack = this.$getAppComponent().canGoBack();
            // const topFrame = this._findParentFrame();
            //     this.log('actionbar mounted', topFrame, topFrame.canGoBack(), topFrame.backStack);
            //     // clog("topFrame", topFrame && topFrame.canGoBack())
            //     if (topFrame) {
            //         this.canGoBack = topFrame.canGoBack();
            //     }
        }, 0);
    }
    onMenuIcon() {
        // if (this.canGoBack) {
        //     this.$navigateBack();
        // } else {
        this.$getAppComponent().onMenuIcon();
        // }
    }
}
