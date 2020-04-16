<template>
    <Gridlayout opacity="0" scaleX="0.5" scaleY="0.5">
        <StackLayout
            @loaded="onFloatingLoaded"
            class="cardView"
            rippleColor="transparent"
            horizontalAlignment="center"
            verticalAlignment="center"
            marginLeft="20"
            marginRight="20"
            height="300"
            borderRadius="10"
        >
            <GridLayout :backgroundColor="themeColor" colSpan="3" orientation="horizontal" padding="10 20 5 0" columns="auto,*,auto" rows="auto" borderTopLeftRadius="10" borderTopRightRadius="10">
                <Button verticalAlignment="center" rippleColor="white" variant="flat" class="icon-btn" text="mdi-arrow-left" @tap="close" />
                <TextField
                    col="1"
                    class="amount-tf"
                    ref="amountTF"
                    :hint="$t('amount') | capitalize"
                    keyboardType="number"
                    returnKeyType="done"
                    :error="amountError"
                    @loaded="onAmountTFLoaded"
                    @textChange="validateAmount"
                />
                <Label col="2" class="cairn" text="cairn-currency" fontSize="32" color="white" verticalAlignment="bottom" paddingBottom="20" />
            </GridLayout>
            <GridLayout rows="auto">
                <ListItem
                    margin="10 10 10 10"
                    class="cardView"
                    :showBottomLine="false"
                    :overText="$t('recipient')"
                    :title="recipient ? recipient.name : $t('choose_recipient')"
                    rightIcon="mdi-chevron-right"
                    @tap="selectRecipient"
                />
                <!-- <Button col="1" textAlignment="center" marginRight="10" variant="flat" class="big-icon-themed-btn" text="mdi-qrcode-scan" @tap="scanQRCode()" /> -->
            </GridLayout>

            <GridLayout rows="auto">
                <ListItem
                    margin="0 10 3 10"
                    :class="accounts.length > 1 ? 'cardView' : 'flatCardView'"
                    :showBottomLine="false"
                    :overText="$t('account')"
                    :title="account ? account.name : $t('choose_account')"
                    :subtitle="accountBalanceText"
                    :date="account ? account.number : undefined"
                    :rightIcon="accounts.length > 1 ? 'mdi-chevron-right' : undefined"
                    @tap="selectAccount"
                />
            </GridLayout>
            <GridLayout columns="*,auto" rows="auto" margin="0 10 0 10">
                <Button :text="$t('confirm') | capitalize" @tap="submit" :isEnabled="canStartTransfer" />
                <Button padding="0" col="1" fontSize="24" class="mdi" text="mdi-cellphone-message" @tap="sendSMS" :isEnabled="canSendSMS" />
            </GridLayout>
        </StackLayout>
    </Gridlayout>
</template>
<script lang="ts" src="./Floating.ts"></script>
