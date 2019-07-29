<template>
    <Page ref="page" class="page" @loaded="onLoaded">
        <GridLayout rows="auto,auto,*,auto" class="pageContent">
            <CActionBar row="0" modalWindow="true"  elevation="0"/>
            <GridLayout row="1" class="themedBack" orientation="horizontal" padding="20 20 20 5" columns="auto,*" rows="auto">
                <MDTextField col="1"  backgroundColor="#15000000" placeholderColor="white" strokeColor="white" color="white" class="input" fontSize="40" :hint="$t('amount') | titlecase" keyboardType="number" :text="amountStr" :error="amountError" @loaded="onAmountTFLoaded" @textChange="validateAmount" />
                <Label col="0" class="cairn" :text="'cairn-currency' | fonticon" fontSize="42" color="white" verticalAlignment="bottom" paddingBottom="22" />
            </GridLayout>
            <ScrollView row="2" class="pageContent">
                <StackLayout margin="0">

                    <MDCardView margin="20 20 0 20" height="80" verticalAlignment="center" @tap="selectAccount" :isUserInteractionEnabled="accounts.length > 0" marginBottom="10">
                        <ListItem backgroundColor="transparent" :showBottomLine="false" :overText="$t('account')" :title="(account ? account.name : $t('choose_account'))" :subtitle="account ? account.id : undefined" :rightIcon="accounts.length > 0 ? 'mdi-chevron-right' : undefined " />

                    </MDCardView>
                    <MDCardView margin="0 20 0 20" height="80" row="1" verticalAlignment="center" @tap="selectRecipient" marginBottom="10">
                        <ListItem backgroundColor="transparent" :showBottomLine="false" :overText="$t('recipient')" :title="(recipient ? recipient.name : $t('choose_recipient'))" :subtitle="(recipient ? recipient.address : undefined) | address" rightIcon="mdi-chevron-right" />
                    </MDCardView>
                    <MDTextField  backgroundColor="#15000000" margin="0 20 0 20" class="input" :hint="$t('reason') | titlecase" v-model="reason" returnKeyType="next" :error="reasonError" />
                    <MDTextField  backgroundColor="#15000000" margin="10 20 20 20" class="input" :hint="$t('description') | titlecase" v-model="description" />

                </StackLayout>
            </ScrollView>

            <MDButton row="3" v-show="!loading" verticalAlignment="center" :text="$t('confirm') | titlecase" @tap="submit" :isEnabled="canStartTransfer" />
            <MDActivityIndicator row="3" v-show="loading" :busy="loading" width="45" height="45" />

            <StackLayout row="3" v-show="refreshing" backgroundColor="#88ffffff" horizontalAlignment="center" verticalAlignment="center">
                <MDActivityIndicator :busy="refreshing" width="75" height="75" horizontalAlignment="center" verticalAlignment="center" />
            </StackLayout>
        </GridLayout>
    </Page>
</template>

<script lang="ts" src="./TransferWindow.ts" />
