import Vue from "vue"
import AuthService from "~/services/authService"

// declare module vue {
//   interface Vue {

//     // $packageService:PackageService
//     // $bgServiceProvider:BgServiceProvider

//     // $isAndroid: boolean
//     // $isIOS: boolean
//   }
// }
declare module "vue/types/vue" {
    // 3. Declare augmentation for Vue

    interface Vue {
        $authService:AuthService
        // $bgServiceProvider:BgServiceProvider

        $isAndroid: boolean
        $isIOS: boolean
        // readonly $refs: { [key: string]: Vue & { nativeView: any } };
        // readonly $refs: { [key: string]: Vue | Element | Vue[] | Element[] };
    }
}
