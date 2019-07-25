import { Component, Prop } from 'vue-property-decorator';
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

    @Prop({ default: false })
    public modalWindow: boolean;

    // @Prop({ default: false })
    public canGoBack = false;

    @Prop({ default: true })
    public showLogo: boolean;

    get menuIcon() {
        if (this.modalWindow) {
            return 'mdi-close';
        }
        if (this.canGoBack) {
            return gVars.isIOS ? 'mdi-chevron-left' : 'mdi-arrow-left';
        }
        return 'mdi-menu';
    }
    get menuIconVisible() {
        return this.modalWindow || this.canGoBack || this.showMenuIcon;
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
        // if (this.modalWindow) {
        //     this.$modal.close();
        //     return;
        // }
        // if (this.canGoBack) {
        //     this.$navigateBack();
        // } else {
        this.$getAppComponent().onMenuIcon();
        // }
    }
}
