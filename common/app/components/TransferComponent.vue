<template>
    
    <GridLayout rows="auto,auto" @loaded="onLoaded">
        <ScrollView row="0">
            <StackLayout margin="0">
                <GridLayout columns="*,auto" row="1" margin="10 10 0 10">
                    <Button :text="$t('confirm') | capitalize" @tap="submit" :isEnabled="canStartTransfer" />
                    <Button padding="0" col="1" fontSize="24" class="mdi" text="mdi-cellphone-message" @tap="sendSMS" :isEnabled="canSendSMS" />
                </GridLayout>
                <GridLayout columns="*,auto">
                    <ListItem
                        margin="0 0 10 20"
                        :height="80"
                        class="cardView"
                        :showBottomLine="false"
                        :overText="$t('recipient')"
                        :title="recipient ? recipient.name : $t('choose_recipient')"
                        rightIcon="mdi-chevron-right"
                        @tap="selectRecipient"
                    />
                    <Button col="1" textAlignment="center" marginRight="10" variant="flat" class="big-icon-themed-btn" text="mdi-qrcode-scan" @tap="scanQRCode()" />
                </GridLayout>

                <ListItem
                    margin="0 20 10 20"
                    :height="80"
                    :class="accounts.length > 1 ? 'cardView' : 'flatCardView'"
                    :showBottomLine="false"
                    :overText="$t('account')"
                    :title="account ? account.name : $t('choose_account')"
                    :subtitle="accountBalanceText"
                    :date="account ? account.number : undefined"
                    :rightIcon="accounts.length > 1 ? 'mdi-chevron-right' : undefined"
                    @tap="selectAccount"
                />

                <!-- <TextField
                        backgroundColor="#ffffff"
                        margin="0 20 0 20"
                        class="input"
                        :hint="$t('reason') | capitalize"
                        v-model="reason"
                        returnKeyType="next"
                        :error="reasonError"
                    /> -->
                <TextField
                    backgroundColor="#ffffff"
                    margin="10 20 20 20"
                    class="input"
                    :floatingLabel="$t('description') | capitalize"
                    :hint="$t('description_optional') | capitalize"
                    v-model="description"
                />
            </StackLayout>
        </ScrollView>

        <!-- <MDActivityIndicator row="3" v-show="loading" :busy="loading" width="45" height="45" /> -->

        <StackLayout row="1" v-show="refreshing" backgroundColor="#88ffffff" horizontalAlignment="center" verticalAlignment="center">
            <MDActivityIndicator :busy="refreshing" width="75" height="75" horizontalAlignment="center" verticalAlignment="center" />
        </StackLayout>
    </GridLayout>
</template>
<script lang="ts" src="./TransferComponent.ts" />
