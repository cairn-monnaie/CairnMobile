import { locals } from '~/variables.module.scss';
import { screen } from '@nativescript/core/platform';
import { ad } from '@nativescript/core/utils/utils';
import { off as appOff, on as appOn, ios as iosApp, launchEvent } from '@nativescript/core/application';

export const primaryColor: string = locals.primaryColor;
export const accentColor: string = locals.accentColor;
export const darkColor: string = locals.darkColor;
export const backgroundColor: string = locals.backgroundColor;
export const latoFontFamily: string = locals.latoFontFamily;
export const cairnFontFamily: string = locals.cairnFontFamily;
export const actionBarHeight: number = parseFloat(locals.actionBarHeight);
export const statusBarHeight: number = parseFloat(locals.statusBarHeight);
export const actionBarButtonHeight: number = parseFloat(locals.actionBarButtonHeight);
export const screenHeightDips = screen.mainScreen.heightDIPs;
export const screenWidthDips = screen.mainScreen.widthDIPs;
export let navigationBarHeight: number = parseFloat(locals.navigationBarHeight);

console.log('cairnFontFamily', cairnFontFamily);
if (gVars.isAndroid) {
    const context: android.content.Context = ad.getApplicationContext();
    const hasPermanentMenuKey = android.view.ViewConfiguration.get(context).hasPermanentMenuKey();
    if (hasPermanentMenuKey) {
        navigationBarHeight = 0;
    }
} else {
    navigationBarHeight = 0;
    const onAppLaunch = function () {
        navigationBarHeight = iosApp.window.safeAreaInsets.bottom;
        appOff(launchEvent, onAppLaunch);
    };
    appOn(launchEvent, onAppLaunch);
}
