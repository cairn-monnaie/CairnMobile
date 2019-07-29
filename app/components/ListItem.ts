import { Component, Prop, Watch } from 'vue-property-decorator';
import BaseVueComponent from '~/components/BaseVueComponent';

@Component({
    inheritAttrs: false
})
export default class ListItem extends BaseVueComponent {
    @Prop({})
    title: string;
    @Prop({ default: 1 })
    sizeFactor: number;
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

    @Prop({ default: '#5C5C5C' })
    overlineColor: string;
    @Prop({ default: '#676767' })
    subtitleColor: string;

    @Watch('avatar')
    onAvatar(value, oldValue) {
        // console.log('onAvatar', value, oldValue, new Error().stack);
        this.nativeView && this.nativeView.requestLayout();
    }

    get showAvatar() {
        console.log('showAvatar', !!this.avatar);
        return !!this.avatar;
    }

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
