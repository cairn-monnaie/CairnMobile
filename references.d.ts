/// <reference path="./node_modules/tns-platform-declarations/ios.d.ts" />
/// <reference path="./node_modules/tns-platform-declarations/android-26.d.ts" />
/// <reference path="./vue.shim.d.ts" />

declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}
declare module "*.scss";


declare const gVars: {
  isIOS: boolean;
  isAndroid: boolean;
  CARTO_TOKEN: string;
  BUGNSAG: string;
}

declare const TNS_ENV;
declare const LOG_LEVEL: string;
declare const TEST_LOGS: string;