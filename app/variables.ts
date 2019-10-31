import { locals as ILocals } from '~/variables.scss';
import { screen } from '@nativescript/core/platform';
let locals: typeof ILocals;

locals = require('./variables.scss').locals;

export const primaryColor: string = locals.primaryColor;
export const accentColor: string = locals.accentColor;
export const darkColor: string = locals.darkColor;
export const backgroundColor: string = locals.backgroundColor;
export const actionBarHeight: number = parseFloat(locals.actionBarHeight);
// export const actionBarButtonHeight: number = parseFloat(locals.actionBarButtonHeight);
export const screenHeightDips = screen.mainScreen.heightDIPs;
export const screenWidthDips = screen.mainScreen.widthDIPs;
