import Vue from 'nativescript-vue';
import { Component, Prop } from 'vue-property-decorator';
import { listBorderColor, subtitleColor } from '~/variables';

@Component({
    template: /*html*/ `
    <GridLayout columns="16,*,auto,16" backgroundColor="white" @tap="$emit('tap', $event)" rows="12,auto,12">
        <StackLayout row="1" col="1" verticalAlignment="center">
            <Label fontSize="17" :text="title" textWrap="true" verticalTextAlignment="top" maxLines="2" lineBreak="end" />
            <Label v-show="!!subtitle" fontSize="14" :text="subtitle" verticalTextAlignment="top" :color="subtitleColor" :maxLines="subtitleMaxLines" lineBreak="end" />
        </StackLayout>
        <Switch row="1" col="2" verticalAlignment="center" :checked="value" @checkedChange="$emit('input', $event.value)"/>
        <AbsoluteLayout row="2" col="1" colSpan="3" backgroundColor="${listBorderColor}" height="1" verticalAlignment="bottom" />
    </GridLayout>`
})
export default class SettingSwitchWithSubtitle extends Vue {
    @Prop({ type: String }) title: string;
    @Prop({ type: String }) subtitle: string;
    @Prop({ type: Boolean }) value: boolean;
    @Prop({ default: subtitleColor, type: String }) subtitleColor: string;
    @Prop({ default: 2, type: Number })
    subtitleMaxLines: number;

}
