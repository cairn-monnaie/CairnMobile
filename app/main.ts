import Vue, { registerElement } from "nativescript-vue"

import "./styles.scss"
import { isAndroid, isIOS } from "platform"

import AuthService from "./services/AuthService"

export const authService = new AuthService()

// if (TNS_ENV !== "production") {
//   import("nativescript-vue-devtools").then(VueDevtools => Vue.use(VueDevtools));
// }

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = TNS_ENV !== "development"
Vue.config["debug"] = TNS_ENV === "development"

Vue.prototype.$authService = authService

import { fonticon, TNSFontIcon } from "nativescript-fonticon"

// import CollectionView from "nativescript-collectionview/vue";
// Vue.use(CollectionView);

registerElement(
    "MDCButton",
    () => require("~/nativescript-material-components/button").Button
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
// registerElement("CardView", () => require('~/nativescript-material-components/cardview').CardView);

import App from "~/components/App.vue"
import Login from "~/components/Login.vue"

// import { SVGImage } from '@teammaestro/nativescript-svg';
// registerElement('SVGImage', () => SVGImage);

TNSFontIcon.paths = {
    mdi: "./assets/mdi.css"
}
TNSFontIcon.loadCss()
Vue.filter("fonticon", fonticon)

Vue.filter("uppercase", function(value) {
    if (!value) return ""
    value = value.toString()
    return value.toUpperCase()
})

Vue.prototype.$isAndroid = isAndroid
Vue.prototype.$isIOS = isIOS

new Vue({
    render: h => {
        return h("frame", [h(authService.isLoggedIn() ? App : Login)])
    }
}).$start()
