<template>
    <Page ref="page" class="page">
        <GridLayout>
            <GridLayout class="pageContent" rows="auto,*">
                <MDCardView margin="10"  isUserInteractionEnabled="false">
                    <StackLayout orientation="horizontal" height="50">
                        <MDButton variant="flat" color="gray" :rippleColor="themeColor" class="icon-btn" :text="'mdi-close' | fonticon" @tap="close()" />
                        <MDTextField width="100%" class="input" floating="false" fontSize="17" variant="none" ref="textField"  color="black" height="50" verticalAlignment="center" @focus="onFocus" @blur="onBlur" @textChange="onTextChange" paddingRight="5" @loaded="onTFLoaded"/>
                    </StackLayout>
                </MDCardView>
                <CollectionView row="1" :items="dataItems" rowHeight="70">
                    <v-template>
                        <ListItem :avatar="item.image" :title="item.name" :subtitle="item.address | address" :overText="(!!item.isBeneficiary? $t('saved_beneficiary') : null)" @tap="chooseRecipient(item)"/>
                    </v-template>
                </CollectionView>
            </GridLayout>
        </GridLayout>
    </Page>
</template>

<script lang="ts" src="./UserPicker.ts" />
