import { Component, Prop } from 'vue-property-decorator';
import BaseVueComponent from '~/components/BaseVueComponent';

@Component({
    inheritAttrs: false
})
export default class ListItem extends BaseVueComponent {
    @Prop({})
    title: string;
    @Prop({})
    subtitle: string;
    @Prop({})
    overText: string;
    @Prop({})
    date: string;
    @Prop({})
    rightIcon: string;
    @Prop({})
    rightButton: string;
    @Prop({})
    leftIcon: string;
    @Prop({})
    avatar: string;
    @Prop({ default: true })
    showBottomLine: boolean;

    @Prop({ default: '#676767' })
    overlineColor: string;
    @Prop({ default: '#676767' })
    subtitleColor: string;

    mounted() {
        super.mounted();
    }
    destroyed() {
        super.destroyed();
    }

    // get height() {
    //     if (this.leftIcon) {
    //         return 72;
    //     }
    // }
}
