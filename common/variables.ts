import { Screen } from '@nativescript/core/platform';
import { ad } from '@nativescript/core/utils/utils';
import { off as appOff, on as appOn, ios as iosApp, launchEvent } from '@nativescript/core/application';
import CSSLoader from '~/common/variables.module.scss';

const locals = CSSLoader.locals;
// console.log('loading variables', locals);
export const primaryColor: string = locals.primaryColor;
export const accentColor: string = locals.accentColor;
export const darkColor: string = locals.darkColor;
export const backgroundColor: string = locals.backgroundColor;
export const subtitleColor: string = locals.subtitleColor;
export const listBorderColor: string = locals.listBorderColor;
export const iconColor: string = locals.iconColor;
export const latoFontFamily: string = locals.latoFontFamily;
export const cairnFontFamily: string = locals.cairnFontFamily;
export const mdiFontFamily: string = locals.mdiFontFamily;
export const actionBarHeight: number = parseFloat(locals.actionBarHeight);
export const statusBarHeight: number = parseFloat(locals.statusBarHeight);
export const actionBarButtonHeight: number = parseFloat(locals.actionBarButtonHeight);
export const screenHeightDips = Screen.mainScreen.heightDIPs;
export const screenWidthDips = Screen.mainScreen.widthDIPs;
export let navigationBarHeight: number = parseFloat(locals.navigationBarHeight);

if (global.isAndroid) {
    const context: android.content.Context = ad.getApplicationContext();
    const hasPermanentMenuKey = android.view.ViewConfiguration.get(context).hasPermanentMenuKey();
    if (hasPermanentMenuKey) {
        navigationBarHeight = 0;
    }
} else {
    navigationBarHeight = 0;
    const onAppLaunch = function() {
        navigationBarHeight = iosApp.window.safeAreaInsets.bottom;
        appOff(launchEvent, onAppLaunch);
    };
    appOn(launchEvent, onAppLaunch);
}
