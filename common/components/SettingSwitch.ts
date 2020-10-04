import Vue from 'nativescript-vue';
import { Component, Prop } from 'vue-property-decorator';
import { listBorderColor } from '../variables';

@Component({
    template: /*html*/`
    <GridLayout  columns="16,*,auto,16" backgroundColor="white" @tap="$emit('tap', $event)" rows="12,auto,12">
        <Label row="1" col="1" fontSize="17" :text="title" textWrap="true" verticalTextAlignment="center" maxLines="2" lineBreak="end" />
        <Switch row="1" col="2" verticalAlignment="center" :checked="value" @checkedChange="$emit('input', $event.value)"/>
        <AbsoluteLayout row="2" col="1" colSpan="3" backgroundColor="${listBorderColor}" height="1" verticalAlignment="bottom" />
    </GridLayout>`
})
export default class SettingSwitch extends Vue {
    @Prop({ type: String }) title: string;
    @Prop({ type: Boolean }) value: boolean;
}
