import { Component, Prop } from 'vue-property-decorator';
import Vue from 'nativescript-vue';
import { Frame, topmost } from 'tns-core-modules/ui/frame/frame';
@Component({})
export default class CActionBar extends Vue {
    @Prop({})
    public title: string;
    @Prop({})
    public subtitle: string;

    @Prop({ default: false })
    public canGoBack = false;

    constructor() {
        super();
    }
    _findParentFrame() {
        let frame: any = topmost();
        if (!frame) {
            frame = this.$parent;
            while (frame && frame.$parent && frame.$options.name !== 'Frame') {
                frame = frame.$parent;
            }
            // console.log("_findParentFrame1", frame["nativeView"])
            // console.log("_findParentFrame2", frame && frame.$options.name)
            // console.log("_findParentFrame3", topmost())

            if (frame && frame.$options.name === 'Frame') {
                return frame['nativeView'] as Frame;
            }
            return undefined;
        } else {
            return frame;
        }
    }
    mounted() {
        setTimeout(() => {
            const topFrame = this._findParentFrame();
            // console.log("actionbar mounted", this.$parent)
            // console.log("topFrame", topFrame && topFrame.canGoBack())
            if (topFrame) {
                this.canGoBack = topFrame.canGoBack();
            }
        }, 0);
    }
    onBackButton() {
        return this.$navigateBack();
    }
}
