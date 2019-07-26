import { NavigationEntry, Page, topmost } from 'tns-core-modules/ui/frame/frame';
import { VueConstructor } from 'vue';
import BaseVueComponent from './BaseVueComponent';

export default class BasePageComponent extends BaseVueComponent {
    navigateUrl;
    loading = false;
    navigateTo(component: VueConstructor, options?: NavigationEntry & { props?: any }, cb?: () => Page) {
        options = options || {};
        (options as any).frame = topmost().id;
        return this.$navigateTo(component, options, cb);
    }
    destroyed() {
        super.destroyed();
    }
    mounted() {
        super.mounted();
    }
    showError(err: Error | string) {
        this.loading = false;
        super.showError(err);
    }
    close() {
        this.$getAppComponent().navigateBackIfUrl(this.navigateUrl);
    }
}
