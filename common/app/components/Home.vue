<template>
    <CairnPage @navigatedTo="onNavigatedTo" showMenuIcon>
        <GridLayout columns="*,50,*" rows="*,50,*">
            <PullToRefresh col="0" row="0" colSpan="3" rowSpan="3" @refresh="refresh">
                <CollectionView :items="accounts" rowHeight="180">
                    <v-template>
                        <StackLayout>
                            <GridLayout class="cardView" margin="20" padding="10" columns="*, auto" rows="auto, *" @tap="onItemTap(item)">
                                <Label row="0" :text="item.name | capitalize" fontWeight="bold" fontSize="18" />
                                <Label row="1" class="balance" :text="item.balance | currency(false)" paddingTop="20">
                                    <Span :text="item.balance | currency(false)" />
                                    <Span :fontFamily="cairnFontFamily" text="cairn-currency" />
                                </Label>
                                <Label col="1" rowSpan="2" class="mdi" text="mdi-chevron-right" fontSize="30" color="gray" verticalAlignment="center" />
                            </GridLayout>
                        </StackLayout>
                    </v-template>
                </CollectionView>
            </PullToRefresh>
            <Fab colSpan="3" rowSpan="3" iconClass="mdi" icon="mdi-plus" iconOn="mdi-close" :backgroundColor="accentColor" color="white" paddingTop='-60'>
                <FabItem :title="$t('transfer') | capitalize" iconClass="mdi" icon="mdi-bank-transfer" @tap="openTransferWindow" />
                <FabItem :title="$t('add_beneficiary') | capitalize" iconClass="mdi" icon="mdi-account-plus" @tap="addBeneficiary" />
            </Fab>
        </GridLayout>
    </CairnPage>
</template>

<script lang="ts" src="./Home.ts" />