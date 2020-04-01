<template>
    <!-- <Frame> -->
        <CairnPage actionBarHidden>
            <GridLayout>
                <GridLayout class="pageContent" rows="auto,*">
                    <StackLayout class="flatCardView"  orientation="horizontal" height="50" margin="10">
                        <MDButton variant="flat" color="gray" class="icon-themed-btn" text="mdi-close" @tap="close()" />
                        <MDTextField width="100%" class="input" floating="false" fontSize="17" variant="none" ref="textField" color="black" height="50" :hint="$t('address') | capitalize" verticalAlignment="center" @focus="onFocus" @blur="onBlur" @textChange="onTextChange" paddingRight="5" @loaded="onTFLoaded" />
                        <MDActivityIndicator v-show="loading" busy class="activity-indicator" width="20" height="20" />
                    </StackLayout>
                    <CollectionView row="1" :items="dataItems" rowHeight="80">
                        <v-template>
                            <ListItem :title="item | address" @tap="chooseAddress(item)" />
                        </v-template>
                    </CollectionView>
                </GridLayout>
            </GridLayout>
        </CairnPage>
    <!-- </Frame> -->
</template>

<script lang="ts" src="./AddressPicker.ts" />
