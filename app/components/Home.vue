<template>
    <Page ref="page" class="page" @navigatedTo="onNavigatedTo">
        <GridLayout rows="auto,*,70" class="pageContent">
            <CActionBar row="0" title="home" />
            <GridLayout row="1" rowSpan="2" columns="*,50,*" rows="*,50,*">
                <PullToRefresh col="0" row="0" colSpan="3" rowSpan="3" @refresh="refresh">
                    <ListView :items="accounts" backgroundColor="transparent" @itemTap="onItemTap" @itemLoading="onItemLoading" separatorColor="transparent">
                        <v-template>
                            <StackLayout backgroundColor="transparent">
                                <MDCardView margin="20" @onTap="onCardTap(item)">
                                    <GridLayout padding="10" isUserInteractionEnabled="false" columns="*, auto">
                                        <StackLayout col="0">
                                            <Label :text="item.name | titlecase" fontWeight="bold" fontSize="18" />
                                            <StackLayout orientation="horizontal" paddingTop="20">
                                                <Label col="0" class="balance" :text="item.balance | currency(false)" />
                                                <Label col="1" class="currency" text="" />
                                            </StackLayout>
                                        </StackLayout>
                                        <Label col="1" class="mdi" :text="'mdi-chevron-right' | fonticon" fontSize="30" color="gray" />
                                    </GridLayout>
                                </MDCardView>
                            </StackLayout>
                        </v-template>
                    </ListView>
                </PullToRefresh>
                <MDActivityIndicator v-show="loading" row="1" col="1" :busy="loading" />
            </GridLayout>
            <DockLayout row="2" width="100%" stretchLastChild="false">
                <transition name="scale" :duration="200" mode="out-in">
                    <MDButton dock="right" class="floating-btn buttonthemed" :text="'mdi-plus' | fonticon" v-show="!loading" />
                </transition>
            </DockLayout>
        </GridLayout>
    </Page>
</template>

<script lang="ts" src="./Home.ts" />
<style lang="scss" scoped>
@import "../app";

.balance {
    color: $primary-color;
    font-size: 30;
}
.currency {
    @extend .cairn;
    font-size: 14;
    font-weight: 900;
    vertical-align: top;
    padding-top: 5;
    padding-left: 3;
}
</style>