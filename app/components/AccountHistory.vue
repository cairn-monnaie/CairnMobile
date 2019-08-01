<template>
    <CairnPage @navigatedTo="onLoaded" :title="$t('account_history')" :subtitle="accountInfo.name">
        <StackLayout slot="actionBarSubView" row='1' col="1" colSpan="2" height="100" marginRight="10">
            <Label :text="$t('balance') | capitalize" verticalAlignment="center" fontSize="14" color="#88ffffff" />
            <Label verticalAlignment="center" fontSize="30" color="white">
                <Span :text="accountInfo.balance | currency"></Span>
                <Span class="cairn" :text="'cairn-currency' | fonticon" />
            </Label>
        </StackLayout>
        <GridLayout columns="*,50,*" rows="*,50,*" zIndex="0">
            <PullToRefresh @refresh="refresh" colSpan="3" rowSpan="3">
                <CollectionView :items="dataItems" rowHeight="80">
                    <v-template>
                        <GridLayout width="100%" columns="*,auto" rows="auto,*" padding="16" borderBottomWidth="1" borderBottomColor="lightgray" backgroundColor="white">
                            <Label row="1" :text="item.reason" fontSize="14" verticalAlignment="bottom" />
                            <Label verticalAlignment="top" row="0" fontSize="14" color="#6F6F6F" maxLines="3" whiteSpace="nowrap">
                                <Span fontWeight="bold" :text="item.credit ? item.debitorName : item.creditorName" color="black" />
                                <Span :text="' - ' +  item.description" />

                            </Label>
                            <Label col="1" row="0" verticalAlignment="bottom" :text="item.submissionDate | dateRelative" fontSize="14" color="#6F6F6F" horizontalAlignment="right" />
                            <Label col="1" row="1" horizontalAlignment="right" verticalAlignment="bottom" fontWeight="bold" :text=" item.amount | currency " fontSize="16" :color="item.credit ? accentColor : '#FC5457'">
                                <Span :text="item.credit ? '+' : '-' "></Span>
                                <Span :text="item.amount | currency"></Span>
                                <Span class="cairn" :text="'cairn-currency' | fonticon" />
                            </Label>
                        </GridLayout>
                    </v-template>
                </CollectionView>
            </PullToRefresh>
        </GridLayout>
    </CairnPage>
</template>

<script lang="ts" src="./AccountHistory.ts" />