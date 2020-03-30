<template>
    <CairnPage @navigatedTo="onLoaded" :title="$t('account_history')" :subtitle="accountInfo.name">
        <StackLayout slot="actionBarSubView" row="1" col="1" colSpan="2" height="100" marginRight="10">
            <Label :text="$t('balance') | capitalize" verticalAlignment="center" fontSize="14" color="#88ffffff" />
            <Label verticalAlignment="center" fontSize="30" color="white">
                <Span :text="accountInfo.balance | currency"></Span>
                <Span :fontFamily="cairnFontFamily" text="cairn-currency" />
            </Label>
        </StackLayout>
        <GridLayout columns="*,50,*" rows="*,50,*" zIndex="0">
            <PullToRefresh @refresh="refresh" colSpan="3" rowSpan="3">
                <CollectionView :items="dataItems" rowHeight="80">
                    <v-template>
                        <GridLayout width="100%" columns="*,auto" rows="auto,auto,*" padding="16" borderBottomWidth="1" borderBottomColor="lightgray" backgroundColor="white">
                            <Label
                                fontWeight="bold"
                                :text="item.credit ? item.debitorName : item.creditorName"
                                color="black"
                                verticalAlignment="top"
                                row="0"
                                fontSize="14"
                                maxLines="3"
                                textWrap="false"
                            />
                            <Label row="1" :text="item.reason" fontSize="12" verticalAlignment="bottom" />
                            <Label row="2" marginTop="0" v-show="!!item.description" :text="item.description" color="#6F6F6F" fontSize="12" verticalAlignment="bottom" />

                            <Label col="1" row="0" verticalAlignment="bottom" :text="item.executionDate | dateRelative" fontSize="14" color="#6F6F6F" horizontalAlignment="right" />
                            <Label
                                col="1"
                                row="1"
                                rowSpan="2"
                                horizontalAlignment="right"
                                verticalAlignment="bottom"
                                fontWeight="bold"
                                :text="item.amount | currency"
                                fontSize="16"
                                :color="item.credit ? accentColor : '#FC5457'"
                            >
                                <Span :text="item.credit ? '+' : '-'"></Span>
                                <Span :text="item.amount | currency"></Span>
                                <Span :fontFamily="cairnFontFamily" text="cairn-currency" />
                            </Label>
                        </GridLayout>
                    </v-template>
                </CollectionView>
            </PullToRefresh>
        </GridLayout>
    </CairnPage>
</template>

<script lang="ts" src="./AccountHistory.ts" />
