import { Component } from 'vue-property-decorator';
import BaseVueComponent from './BaseVueComponent';
import CairnPage from './CairnPage';
import { Frame, NavigationEntry, topmost } from '@nativescript/core/ui/frame';
import { Page } from '@nativescript/core/ui/page';
import { VueConstructor } from 'vue';
import { bind } from 'helpful-decorators';

@Component({})
export default class PageComponent extends BaseVueComponent {
    public navigateUrl = null;
    constructor() {
        super();
        // this.showMenuIcon = true;
    }

    get loading() {
        return this.page && this.page.loading;
    }
    set loading(value: boolean) {
        if (this.page) {
            this.page.loading = value;
        }
    }

    // get page() {
    //     return
    // }
    page: CairnPage;
    mounted() {
        super.mounted();
        this.page = this.$children[0] as CairnPage;
        console.log(this.$children[0].constructor.name, this.navigateUrl);
        this.page.navigateUrl = this.navigateUrl;
    }
    destroyed() {
        super.destroyed();
    }
    showErrorInternal(err: Error | string) {
        this.loading = false;
        super.showErrorInternal(err);
    }
    close() {
        this.$getAppComponent().navigateBackIfUrl(this.navigateUrl);
    }
    navigateTo(component: VueConstructor, options?: NavigationEntry & { props?: any }, cb?: () => Page) {
        options = options || {};
        (options as any).frame = Frame.topmost().id;
        return this.$navigateTo(component, options, cb);
    }
}
