import { ObservableArray } from '@nativescript/core';
import { Component, Prop } from 'vue-property-decorator';
import BaseVueComponent from './BaseVueComponent';

@Component
export default class FilterCategories extends BaseVueComponent {
    @Prop() categories: {
        id: string;
        slug: string;
        name: string;
    }[];
    @Prop() filterSlugs: string[];

    currentFilterSlugs: string[] = [];
    dataItems: ObservableArray<any> = [] as any;

    mounted() {
        super.mounted();
        this.currentFilterSlugs = this.filterSlugs;
        this.dataItems = new ObservableArray(
            [{ name: this.$tc('all'), selected: this.filterSlugs.length === 0 }].concat(
                this.categories.map(c => ({
                    ...c,
                    selected: this.currentFilterSlugs.indexOf(c.slug) !== -1
                }))
            )
        );
    }
    destroyed() {
        super.destroyed();
    }
    onShownInBottomSheet() {}
    isSelected(item) {
        if (item.slug) {
            const index = this.currentFilterSlugs.indexOf(item.slug);
            return index !== -1;
        } else {
            return this.currentFilterSlugs.length === 0;
        }
    }
    updateItem(key: string, selected: boolean) {
        const index = this.categories.findIndex(d => key === d.slug);
        if (index !== -1) {
            this.dataItems.setItem(index + 1, Object.assign(this.dataItems.getItem(index + 1), { selected }));
        }
    }
    onTap(item) {
        if (!item) {
            return;
        }
        if (item.slug) {
            if (this.currentFilterSlugs.length === 0) {
                this.dataItems.setItem(0, Object.assign(this.dataItems.getItem(0), { selected: false }));
            }
            const index = this.currentFilterSlugs.indexOf(item.slug);
            if (index === -1) {
                this.currentFilterSlugs.push(item.slug);
                this.updateItem(item.slug, true);
            } else {
                this.currentFilterSlugs.splice(index, 1);
                this.updateItem(item.slug, false);
            }
        } else {
            this.currentFilterSlugs.forEach(s => this.updateItem(s, false));
            this.currentFilterSlugs.splice(0, this.currentFilterSlugs.length);
            this.dataItems.setItem(0, Object.assign(this.dataItems.getItem(0), { selected: true }));
        }
    }
}
