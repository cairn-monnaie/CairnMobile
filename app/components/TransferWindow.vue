<template>
    <CairnPage @navigatedTo="onLoaded" :actionBarShowLogo="false">
        <GridLayout slot="actionBarSubView" marginTop="20" row="0" colSpan="3" orientation="horizontal" padding="0 20 5 5" columns="auto,*" rows="auto">
            <MDTextField col="1" backgroundColor="#15000000" placeholderColor="white" strokeColor="white" color="white" class="input" fontSize="40" :hint="$t('amount') | capitalize" keyboardType="number" :text="amountStr" :error="amountError" @loaded="onAmountTFLoaded" @textChange="validateAmount" />
            <Label col="0" class="cairn" :text="'cairn-currency' | fonticon" fontSize="42" color="white" verticalAlignment="bottom" paddingBottom="22" />
        </GridLayout>
        <GridLayout rows="*,auto">
            <ScrollView row="0">
                <StackLayout margin="0">

                    <ListItem margin="20 20 10 20" :height="80" class="cardView" :showBottomLine="false" :overText="$t('account')" :title="(account ? account.name : $t('choose_account'))" :subtitle="account ? account.id : undefined" :rightIcon="accounts.length > 0 ? 'mdi-chevron-right' : undefined " />

                    <ListItem margin="0 20 10 20" :height="80" class="cardView" :showBottomLine="false" :overText="$t('recipient')" :title="(recipient ? recipient.name : $t('choose_recipient'))" :subtitle="(recipient ? recipient.address : undefined) | address" rightIcon="mdi-chevron-right" />
                    <MDTextField backgroundColor="#15000000" margin="0 20 0 20" class="input" :hint="$t('reason') | capitalize" v-model="reason" returnKeyType="next" :error="reasonError" />
                    <MDTextField backgroundColor="#15000000" margin="10 20 20 20" class="input" :hint="$t('description') | capitalize" v-model="description" />

                </StackLayout>
            </ScrollView>

            <MDButton row="1" v-show="!loading" verticalAlignment="center" :text="$t('confirm') | capitalize" @tap="submit" :isEnabled="canStartTransfer" />
            <MDActivityIndicator row="3" v-show="loading" :busy="loading" width="45" height="45" />

            <StackLayout row="1" v-show="refreshing" backgroundColor="#88ffffff" horizontalAlignment="center" verticalAlignment="center">
                <MDActivityIndicator :busy="refreshing" width="75" height="75" horizontalAlignment="center" verticalAlignment="center" />
            </StackLayout>
        </GridLayout>
    </CairnPage>
</template>

<script lang="ts" src="./TransferWindow.ts" />
