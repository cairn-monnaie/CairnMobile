<template>
    <Page ref="page" class="page">
        <ActionBar :title="'home' | L | titlecase" />
        <GridLayout rows="*,70">
            <GridLayout row="0" rowSpan="2" columns="*,50,*" rows="*,50,*">
                <PullToRefresh col="0" row="0" colSpan="3" rowSpan="3" @refresh="refresh">
                    <ListView col="0" row="0" colSpan="3" rowSpan="3" :items="accounts" backgroundColor="transparent" separatorColor="transparent">
                        <v-template>
                            <StackLayout backgroundColor="transparent">
                                <CardView  margin="20">
                                    <StackLayout padding="10" isUserInteractionEnabled="false">
                                        <Label :text="item.name | titlecase" fontWeight="bold" fontSize="18" />
                                        <StackLayout orientation="horizontal" paddingTop="20">
                                            <Label col="0" class="balance" :text="item.balance | currency" />
                                            <Label col="1" class="currency" text="airn" />
                                        </StackLayout>
                                    </StackLayout>

                                </CardView>
                            </StackLayout>
                        </v-template>
                    </ListView>
                </PullToRefresh>
                <MDCActivityIndicator v-show="loading" row="1" col="1" :busy="loading" />
            </GridLayout>
            <DockLayout row="1" width="100%" stretchLastChild="false">
                <transition name="scale" :duration="200" mode="out-in">
                    <MDCButton @tap="startDirections" dock="right" class="floating-btn buttonthemed" :text="'mdi-plus' | fonticon" v-show="!loading"  />
                </transition>
            </DockLayout>
        </GridLayout>
    </Page>
</template>

<script lang="ts">
import BasePageComponent from "./BasePageComponent"
import { Component } from "vue-property-decorator"
import { isAndroid } from "platform"
import { CustomTransition } from "~/transitions/custom-transition"
import { topmost, Color } from "tns-core-modules/ui/frame"
import Login from "./Login.vue"
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array"

@Component({})
export default class Home extends BasePageComponent {
    loading = true
    accounts: any = []
    constructor() {
        super()
    }
    mounted() {
        super.mounted()

        console.log("test home page", this.loading)
        this.refresh()
    }
    onItemLoading(args) {
        if (this.$isIOS) {
            var newcolor = new Color(0, 255, 255, 255)
            args.ios.backgroundView.backgroundColor = newcolor.ios
        }
    }
    onStackLoaded(args) {
        console.log('onStackLoaded');
        args.object.android.setClipChildren(false);
    }
    refresh(args?) {
        if (args && args.object) {
            args.object.refreshing = false
        }
        console.log("refreshing")
        this.loading = true
        this.$authService.getAccounts().then(r => {
            console.log("got accounts", r)
            const accounts = []
            r.accounts.forEach(a => {
                accounts.push({
                    balance: parseFloat(a.status.balance),
                    id: a.type.id.toString(),
                    name: a.type.name.toString()
                })
            })
            console.log("got accounts done ", accounts)
            this.accounts = new ObservableArray(accounts) as any
            this.loading = false
        })
    }
    onNavigatingTo() {
        // if (isAndroid) {
        //     const page = this.page
        //     // page.androidStatusBarBackground = null;
        //     // page.androidStatusBarBackground = new Color(this.darkColor);
        // }
    }
    // openMain() {
    //     this.$navigateTo(Login, { clearHistory: true })
    // }
    // openIn() {
    // this.navigateTo(HomePage as any)
    // }
}
</script>
<style lang="scss" scoped>
@import "../styles";

.balance {
    color: $primary-color;
    font-size: 50;
}
.currency {
    @extend .cairn;
    font-size: 17;
    font-weight: 900;
    vertical-align: top;
    padding-top: 5;
    padding-left: 3;
}
</style>