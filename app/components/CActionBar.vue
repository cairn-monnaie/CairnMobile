<template>
    <StackLayout class="actionBar">
        <GridLayout class="actionBarBar" orientation="horizontal" ios:paddingTop="0.001" columns="auto,*">
            <MDCButton col="0" variant= "text" :visibility="canGoBack ? 'visible' : 'hidden'" class="actionBarButton" :text="($isIOS? 'mdi-chevron-left' : 'mdi-arrow-left') | fonticon" @tap="onBackButton" />
            <StackLayout :col="$isIOS && !canGoBack ? 0 : 1" ios:colSpan="2" verticalAlignment="center">
                <Label class="actionBarTitle" :textAlignment="$isIOS && !canGoBack ? 'center' : 'left'" verticalAlignment="center" :text="title | L | titlecase" fontWeight="bold"/>
                <Label :visibility="!!subtitle ? 'visible' : 'hidden'"  :textAlignment="$isIOS && !canGoBack ? 'center' : 'left'" class="actionBarSubtitle" verticalAlignment="center" :text="subtitle" />
            </StackLayout>
        </GridLayout>
        <slot />
    </StackLayout>
</template>

 <script lang="ts">
import { Component, Prop } from "vue-property-decorator"
import Vue from "nativescript-vue"
import { topmost, Frame } from "tns-core-modules/ui/frame/frame"
@Component({})
export default class CActionBar extends Vue {
    
    @Prop({})
    public title: string
    @Prop({ default: false })
    public subtitle: string

    @Prop({ default: false })
    public canGoBack = false

    constructor() {
        super()
    }
    _findParentFrame() {
        let frame: any = topmost()
        if (!frame) {
            frame = this.$parent
            while (frame && frame.$parent && frame.$options.name !== "Frame") {
                frame = frame.$parent
            }
            // console.log("_findParentFrame1", frame["nativeView"])
            // console.log("_findParentFrame2", frame && frame.$options.name)
            // console.log("_findParentFrame3", topmost())

            if (frame && frame.$options.name === "Frame") {
                return frame["nativeView"] as Frame
            }
            return undefined
        } else {
            return frame
        }
    }
    mounted() {
        setTimeout(() => {
            const topFrame = this._findParentFrame()
            // console.log("actionbar mounted", this.$parent)
            // console.log("topFrame", topFrame && topFrame.canGoBack())
            if (topFrame) {
                this.canGoBack = topFrame.canGoBack()
            }
        }, 0)
    }
    onBackButton() {
        return this.$navigateBack()
    }
}
</script>

<style lang="scss" scoped>

@import "../styles";

.actionBar {
    background-color: $dark-color;
}
.actionBarBar {
    height: $actionbar-height;
}

.actionBarButton {
    @extend .mdi;
    width: $actionbar-height;
    height: $actionbar-height;
    margin:0;
    padding:0;
    font-size: 32;
    border-radius: $actionbar-height/2;
    color: #ffffff;
    ripple-color: #88ffffff;
}

.actionBarTitle {
    vertical-alignment:center;
    font-size: 18;
    font-weight: 500;
    color: white;
}

.actionBarSubtitle {
    font-size: 13;
    color: #88ffffff;
}

</style>