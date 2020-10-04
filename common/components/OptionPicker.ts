import Vue from 'nativescript-vue';
import { Component, Prop } from 'vue-property-decorator';

@Component({})
export default class OptionPicker extends Vue {
    @Prop({})
    public options: { name: string; checked: boolean }[];

    // public height = '100%';
    @Prop({ default: Vue.prototype.$t('pick_options') })
    title: string;
    public constructor() {
        super();
    }

}
