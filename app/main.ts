import { Fabric } from "nativescript-fabric"
Fabric.init()

import Vue, { registerElement } from "nativescript-vue"

require("nativescript-platform-css")

import "./styles.scss"
import { isAndroid, isIOS } from "tns-core-modules/platform"

import AuthService, { LoggedoutEvent, LoggedinEvent } from "./services/AuthService"

export const authService = new AuthService()

// if (TNS_ENV !== "production") {
//   import("nativescript-vue-devtools").then(VueDevtools => Vue.use(VueDevtools));
// }

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = TNS_ENV !== "development"
Vue.config["debug"] = TNS_ENV === "development"

Vue.prototype.$authService = authService

authService.on(LoggedinEvent, () => {
    Vue.prototype.$navigateTo(App, { clearHistory: true })
})
authService.on(LoggedoutEvent, () => {
    Vue.prototype.$navigateTo(Login, { clearHistory: true })
})

// import CollectionView from "nativescript-collectionview/vue";
// Vue.use(CollectionView);

import { primaryColor } from "./variables"
import { themer } from "~/nativescript-material-components/material"
import {alert} from "~/nativescript-material-components/dialog"
if (isIOS) {
    //material theme
    console.log("setPrimaryColor", primaryColor)
    themer.setPrimaryColor(primaryColor)
}


registerElement(
    "MDCButton",
    () => require("~/nativescript-material-components/button").Button
)
registerElement(
    "CardView",
    () => require("~/nativescript-material-components/cardview").CardView
)
registerElement(
    "HTMLLabel",
    () => require("nativescript-htmllabel/label").Label
)
registerElement(
    "MDCTextField",
    () => require("~/nativescript-material-components/textfield").TextField,
    {
        model: {
            prop: "text",
            event: "textChange"
        }
    }
)

import RadListViewPlugin from 'nativescript-ui-listview/vue';
Vue.use(RadListViewPlugin);

import App from "~/components/App.vue"
import Login from "~/components/Login.vue"

// import { SVGImage } from '@teammaestro/nativescript-svg';
// registerElement('SVGImage', () => SVGImage);

import { fonticon, TNSFontIcon } from "nativescript-fonticon"
TNSFontIcon.paths = {
    mdi: "./assets/mdi.css"
}
TNSFontIcon.loadCss()
Vue.filter("fonticon", fonticon)

import VueStringFilter from "vue-string-filter/VueStringFilter"
Vue.use(VueStringFilter)

import { localize } from "nativescript-localize"
Vue.filter("L", localize)
Vue.filter("currency", function(value: number) {
    return value.toFixed(2).replace(".", ",")
})


Vue.prototype.$isAndroid = isAndroid
Vue.prototype.$isIOS = isIOS
const filters = (Vue.prototype.$filters = Vue["options"].filters)
Vue.prototype.$ltc = function(s: string, ...args) {
    return filters.titlecase(localize(s, ...args))
}
Vue.prototype.$luc = function(s: string, ...args) {
    return filters.uppercase(localize(s, ...args))
}
Vue.prototype.$showError = function(err: Error) {
    console.log('showError', err, err.toString());
    return alert({
        title: Vue.prototype.$ltc("error"),
        okButtonText: Vue.prototype.$ltc("ok"),
        message: err.toString()
    })
}
Vue.prototype.$alert = function(message) {
    return alert({
        okButtonText: Vue.prototype.$ltc("ok"),
        message: message
    })
}

const currentlyLoggedin = authService.isLoggedIn()

if (currentlyLoggedin) {
    authService.login() // login async to refresh token
}

new Vue({
    render: h => {
        return h("frame", [h(currentlyLoggedin ? App : Login)])
    }
}).$start()
