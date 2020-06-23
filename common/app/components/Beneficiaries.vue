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
            <Label textAlignment="center" verticalTextAlignment="center" color="#888" :text="$tc('no_favorite')"/>
            <Button row="1" :text="$tc('add_favorite')" @tap="addBeneficiary" />
        </GridLayout>
    </CairnPage>
</template>

<script lang="ts" src="./Beneficiaries.ts" />