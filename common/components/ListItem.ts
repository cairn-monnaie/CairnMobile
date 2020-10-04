import { Component, Prop, Watch } from 'vue-property-decorator';
import BaseVueComponent from './BaseVueComponent';
import { iconColor, listBorderColor, subtitleColor } from '../variables';

@Component({
    inheritAttrs: false
})
export default class ListItem extends BaseVueComponent {
    public listBorderColor = listBorderColor;
    public iconColor = iconColor;

    @Prop({ type: String })
    title: string;
    @Prop({ default: 1, type: Number })
    sizeFactor: number;
    @Prop({ default: 2, type: Number })
    subtitleMaxLines: number;
    @Prop({ type: String })
    subtitle: string;
    @Prop({ type: String })
    overText: string;
    @Prop({ type: String })
    date: string;
    @Prop({ type: String })
    rightIcon: string;
    @Prop({ type: String })
    rightButton: string;
    @Prop({ type: String })
    leftIcon: string;
    @Prop({ type: String })
    avatar: string;
    @Prop({ default: true, type: Boolean })
    showBottomLine: boolean;

    @Prop({ default: 12, type: Number })
    topBottomPadding: number;

    @Prop({ default: '#5C5C5C', type: String })
    overlineColor: string;
    @Prop({ default: subtitleColor, type: String })
    subtitleColor: string;

    @Watch('avatar')
    onAvatar(value, oldValue) {
        // console.log('onAvatar', value, oldValue, new Error().stack);
        this.nativeView && this.nativeView.requestLayout();
    }

    get showAvatar() {
        return !!this.avatar;
    }

    mounted() {
        super.mounted();
    }
    destroyed() {
        super.destroyed();
    }
}
