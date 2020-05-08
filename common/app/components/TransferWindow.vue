<template>
    <CairnPage id="transfer" @navigatedTo="onLoaded" :actionBarShowLogo="false">
        <GridLayout slot="actionBarSubView" marginTop="10" row="0" colSpan="3" orientation="horizontal" padding="0 20 5 5" columns="*,auto" rows="auto">
            <TextField
                col="0"
                marginLeft="44"
                placeholderColor="white"
                floatingColor="white"
                strokeColor="white"
                textAlignment="right"
                color="white"
                class="input"
                ref="amountTF"
                fontSize="40"
                :hint="$t('amount') | capitalize"
                keyboardType="number"
                digits="0123456789.,"
                returnKeyType="done"
                :error="amountError"
                @loaded="onAmountTFLoaded"
                @textChange="validateAmount"
            />
            <Label col="1" class="cairn" text="cairn-currency" fontSize="42" color="white" verticalAlignment="bottom" paddingBottom="8" />
        </GridLayout>
        <TransferComponent ref="transferComponent"  @close="close" :qrCodeData="qrCodeData"/>
    </CairnPage>
</template>

<script lang="ts" src="./TransferWindow.ts" />
