import { Frame, NavigationEntry, Page } from '@nativescript/core';
import { VueConstructor } from 'vue';
import { Component } from 'vue-property-decorator';
import BaseVueComponent from './BaseVueComponent';
import CairnPage from './CairnPage';

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
        // console.log('set loading', value, !!this.page);
        if (this.page) {
            this.page.loading = value;
        }
    }

    page: CairnPage;
    mounted() {
        super.mounted();
        this.page = this.$children[0] as CairnPage;
        // console.log(this.$children[0].constructor.name, this.navigateUrl);
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
