<template>
    <Page ref="page" class="page" @loaded="onLoaded">
        <GridLayout rows="auto,*">
            <CActionBar row="0" modalWindow="true" />
            <StackLayout row="1" horizontalAlignment="center" class="pageContent">
                <StackLayout class="themedBack" orientation="horizontal" padding="20">
                    <MDTextField placeholderColor="white" strokeColor="white" color="white" class="input" fontSize="40" :hint="$t('amount') | titlecase" keyboardType="number" :text="amountStr" :error="amountError" @loaded="onAmountTFLoaded" @textChange="validateAmount" />
                    <Label class="cairn" :text="'cairn-currency' | fonticon" fontSize="50" />
                </StackLayout>
                <StackLayout rows="2*,2*,*,auto,*" margin="20">

                    <MDCardView row="0" height="80" verticalAlignment="center" @tap="selectAccount" :isUserInteractionEnabled="accounts.length > 0" marginBottom="10">
                        <ListItem backgroundColor="transparent" :showBottomLine="false" :overText="$t('account')" :title="(account ? account.name : $t('choose_account'))" :subtitle="account ? account.id : undefined" :rightIcon="accounts.length > 0 ? 'mdi-chevron-right' : undefined " />

                    </MDCardView>
                    <MDCardView height="80" row="1" verticalAlignment="center" @tap="selectRecipient" marginBottom="10">
                        <ListItem backgroundColor="transparent" :showBottomLine="false" :overText="$t('recipient')" :title="(recipient ? recipient.name : $t('choose_recipient'))" :subtitle="(recipient ? recipient.address : undefined) | address" rightIcon="mdi-chevron-right" />
                    </MDCardView>
                    <MDTextField  class="input" :hint="$t('reason') | titlecase" v-model="reason" returnKeyType="next" marginBottom="10" :error="reasonError"/>
                    <MDTextField  class="input" :hint="$t('description') | titlecase" v-model="description" marginBottom="10"/>

                    <MDButton row="2" v-show="!loading" verticalAlignment="center" :text="$t('confirm') | titlecase" @tap="submit" :isEnabled="canStartTransfer" marginTop="20" />
                    <MDActivityIndicator row="3" v-show="loading" :busy="loading" width="45" height="45" />
                </StackLayout>
            </StackLayout>
            <StackLayout row="1" v-show="refreshing" backgroundColor="#88ffffff">
                <MDActivityIndicator :busy="refreshing" width="75" height="75" horizontalAlignment="center" verticalAlignment="center" />
            </StackLayout>
        </GridLayout>
    </Page>
</template>

<script lang="ts" src="./TransferWindow.ts" />
