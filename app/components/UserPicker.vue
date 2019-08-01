<template>
    <CairnPage actionBarHidden>
        <GridLayout>
            <GridLayout class="pageContent" rows="auto,*">
                <StackLayout class="cardView" rippleColor="null" orientation="horizontal" height="50" margin="10">
                    <MDButton variant="flat" color="gray" :rippleColor="themeColor" class="icon-btn" :text="'mdi-close' | fonticon" @tap="close()" />
                    <MDTextField width="100%" class="input" floating="false" fontSize="17" variant="none" ref="textField" color="black" height="50" verticalAlignment="center" @focus="onFocus" @blur="onBlur" @textChange="onTextChange" paddingRight="5" @loaded="onTFLoaded" />
                </StackLayout>
                <CollectionView row="1" :items="dataItems" rowHeight="70">
                    <v-template>
                        <ListItem :avatar="item.image" :title="item.name" :subtitle="item.address | address" :overText="(!!item.isBeneficiary? $t('saved_beneficiary') : null)" @tap="chooseRecipient(item)" />
                    </v-template>
                </CollectionView>
            </GridLayout>
        </GridLayout>
    </CairnPage>
</template>

<script lang="ts" src="./UserPicker.ts" />
