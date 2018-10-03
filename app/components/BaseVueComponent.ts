import Vue from "nativescript-vue";
import { Prop } from 'vue-property-decorator'
import { Page, Color } from "tns-core-modules/ui/page/page";
import { isIOS, isAndroid } from "tns-core-modules/platform/platform";

import { primaryColor, actionBarHeight, darkColor } from "../variables";

export default class BaseVueComponent extends Vue {
  public isAndroid = isAndroid;
  public isIOS = isIOS;
  @Prop({ type: String }) public _themeColor;
  @Prop({ type: String }) public _darkColor;
  public actionBarHeight = actionBarHeight;
  get page() {
    if (this.$refs.page) {
      return (this.$refs.page as any).nativeView as Page;
    }
  }
  mounted() {
    const page = this.page;
    if (this.page) {
      page.backgroundSpanUnderStatusBar = true;
      
      // page.backgroundColor = this.themeColor;
      // page.actionBarHidden = true;
      // if (isIOS) {
        // page.statusBarStyle = "dark";
      // } else {
        // page.androidStatusBarBackground = null;
        // page.androidStatusBarBackground = new Color(this.darkColor);
      // }
      // page.backgroundColor = this.themeColor;
    }
   
  }

  get darkColor() {
      return this._darkColor || darkColor;
  }
  get themeColor() {
      return this._themeColor || primaryColor;
  }
}
