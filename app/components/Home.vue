<template>
    <CairnPage @navigatedTo="onNavigatedTo" showMenuIcon>
        <GridLayout columns="*,50,*" rows="*,50,*">
            <PullToRefresh col="0" row="0" colSpan="3" rowSpan="3" @refresh="refresh">
                <CollectionView :items="accounts" @itemTap="onItemTap" rowHeight="180">
                    <v-template>
                        <StackLayout>
                            <GridLayout class="cardView" margin="20" padding="10" columns="*, auto" rows="auto, *">
                                <Label row="0" :text="item.name | capitalize" fontWeight="bold" fontSize="18" />
                                <Label row="1" class="balance" :text="item.balance | currency(false)" paddingTop="20">
                                    <Span :text="item.balance | currency(false)" />
                                    <Span class="cairn" :text="'cairn-currency' | fonticon" />
                                </Label>
                                <Label col="1" rowSpan="2" class="mdi" :text="'mdi-chevron-right' | fonticon" fontSize="30" color="gray" verticalAlignment="center" />
                            </GridLayout>
                        </StackLayout>
                    </v-template>
                </CollectionView>
            </PullToRefresh>
            <Fab colSpan="3" rowSpan="3" iconClass="mdi" :icon="'mdi-plus' | fonticon" :iconOn="'mdi-close' | fonticon" :backgroundColor="accentColor" color="white">
                <FabItem :title="$t('transfer') | capitalize" iconClass="mdi" :icon="'mdi-bank-transfer' | fonticon" @tap="openTransferWindow" />
                <FabItem :title="$t('add_beneficiary') | capitalize" iconClass="mdi" :icon="'mdi-account-plus' | fonticon" @tap="addBeneficiary" />
            </Fab>
        </GridLayout>
    </CairnPage>
</template>

<script lang="ts" src="./Home.ts" />