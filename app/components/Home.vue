<template>
    <Page ref="page" class="page">
        <ActionBar :title="'home' | L | titlecase" />
        <StackLayout>
            <GridLayout columns="*,auto,*" rows="*,auto,*">
                <PullToRefresh col="0" row="0" colSpan="3" rowSpan="3" @refresh="refresh">
                    <ListView col="0" row="0" colSpan="3" rowSpan="3" :items="accounts" backgroundColor="transparent"  separatorColor="transparent">
                        <v-template>
                            <StackLayout padding="20" backgroundColor="transparent">
                                <CardView width="100%" padding="10">
                                    <StackLayout isUserInteractionEnabled="false">
                                        <Label :text="item.name | titlecase" fontWeight="bold" fontSize="18" />
                                        <StackLayout orientation="horizontal" paddingTop="20">
                                            <Label col="0" :text="item.balance | currency" fontSize="50" />
                                            <Label col="1" text="cairn" fontSize="17" verticalAlignment="top" paddingTop="5" />
                                        </StackLayout>
                                    </StackLayout>

                                </CardView>
                            </StackLayout>
                        </v-template>
                    </ListView>
                </PullToRefresh>
                <MDCActivityIndicator v-show="loading" row="1" col="1" :busy="loading" class="activity-indicator" />
            </GridLayout>

        </StackLayout>
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
    loading = false
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
    refresh(args?) {
        if (args && args.object) {
            args.object.refreshing = false;
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
