<template>
    <CairnPage @navigatedTo="onNavigatedTo" :title="$t('beneficiaries')">
        <GridLayout rows="*,auto">
            <PullToRefresh @refresh="refresh">
                <CollectionView :items="dataItems" backgroundColor="transparent" separatorColor="transparent" rowHeight="80">
                    <v-template>
                        <ListItem :avatar="item.image" :title="item.name" :subtitle="item.address | address"   @tap="onItemTap(item)"/>
                    </v-template>
                </CollectionView>
            </PullToRefresh>
            <Button row="1" :text="$tc('add_beneficiary')" @tap="addBeneficiary" />
        </GridLayout>
    </CairnPage>
</template>

<script lang="ts" src="./Beneficiaries.ts" />