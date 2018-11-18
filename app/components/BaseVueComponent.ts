import Vue, { NativeScriptVue } from "nativescript-vue"
import { Prop } from "vue-property-decorator"
import { Page } from "tns-core-modules/ui/page/page"
import { View, Color } from "tns-core-modules/ui/core/view"

import { primaryColor, actionBarHeight, darkColor } from "../variables"

export default class BaseVueComponent extends Vue {
    $refs: {
        page: NativeScriptVue<Page>
    }
    @Prop({ type: String })
    public _themeColor
    @Prop({ type: String })
    public _darkColor
    public actionBarHeight = actionBarHeight
    get page() {
        return this.getRef("page") as Page
    }
    getRef(key: string) {
        if (this.$refs[key]) {
            return this.$refs[key].nativeView as View
        }
    }
    mounted() {
        const page = this.page
        if (this.page) {
            page.backgroundSpanUnderStatusBar = true
            page.backgroundColor = this.darkColor
            page.actionBarHidden = true;
            if (this.$isIOS) {
                page.statusBarStyle = "light"
            } else {
                page.androidStatusBarBackground = null
                page.androidStatusBarBackground = new Color(this.darkColor)
            }
            // page.backgroundColor = this.themeColor;
        }
    }

    get darkColor() {
        return this._darkColor || darkColor
    }
    get themeColor() {
        return this._themeColor || primaryColor
    }
}
