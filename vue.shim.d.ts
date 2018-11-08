import Vue from "vue"
import AuthService from "~/services/authService"

declare module "vue/types/vue" {
    // 3. Declare augmentation for Vue
    interface Vue {
        $authService: AuthService

        $isAndroid: boolean
        $isIOS: boolean
        $ltc: (s: string, ...args) => string
        $luc: (s: string, ...args) => string
        $filters: {
            titleclase(s: string): string
            uppercase(s: string): string
            L(s: string, ...args): string
        }
        $showError(err: Error)
        $alert(message: string)
    }
}
