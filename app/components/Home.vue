<template>
    <Frame ref="frame">
        <Page ref="page" class="page">
            <ActionBar title="Home Page" />
            <StackLayout>
                <MDCButton text="openMain" @tap="openMain" />
                <MDCButton text="openIn" @tap="openIn" />
            </StackLayout>
        </Page>
    </Frame>
</template>

<script lang="ts">
import BaseVueComponent from './BaseVueComponent'
import { Component } from 'vue-property-decorator'
import { isAndroid, screen } from 'platform';
import { ObservableArray } from 'data/observable-array/observable-array';
import { Color } from "tns-core-modules/ui/page/page";
import { CustomTransition } from "~/transitions/custom-transition";
import Login from './Login.vue'


const HomePage = {
    template: `
<Page>
    <ActionBar title="Inner Page" />
	<Label class="m-20" textWrap="true" text="You have successfully authenticated. This is where you build your core application functionality."></Label>
</Page>
`
};

@Component({})
export default class Home extends BaseVueComponent {

    constructor() {
        super();

    }
    mounted() {
        super.mounted();
        // console.log('test home page', this.page);
    }
    onNavigatingTo() {
        if (isAndroid) {
            const page = this.page;
            // page.androidStatusBarBackground = null;
            // page.androidStatusBarBackground = new Color(this.darkColor);
        }
    }
    openMain() {
        const customTransition = new CustomTransition(300, "easeIn");
        this.$navigateTo(Login, {
            // frame: this.$parent.$refs.frame,
            animated: true,
            transitionAndroid: { instance: customTransition }
        })
    }
    openIn() {
        this.$navigateTo(HomePage as any, {
            frame: (this.$refs as any).frame
        } as any)
    }
}
</script>
