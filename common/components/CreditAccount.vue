<template>
    <CairnPage :title="$t('credit_account')">
        <GridLayout>
            <StackLayout verticalAlignment="center">
                <StackLayout orientation="horizontal" horizontalAlignment="center">
                    <TextField
                        :placeholderColor="themeColor"
                        :floatingColor="themeColor"
                        :strokeColor="themeColor"
                        textAlignment="right"
                        width="60%"
                        :color="accentColor"
                        ref="amountTF"
                        fontSize="40"
                        :hint="$t('amount') | capitalize"
                        keyboardType="number"
                        digits="0123456789.,"
                        returnKeyType="done"
                        @loaded="onAmountTFLoaded"
                        @textChange="validateAmount"
                    />
                    <Label
                        class="cairn"
                        text="cairn-currency"
                        fontSize="42"
                        :color="accentColor"
                        verticalAlignment="bottom"
                        paddingBottom="20"
                    />
                </StackLayout>
                <Image src="https://www.helloasso.com/Areas/HelloAsso/img/helloasso-logo.png" width="20%" paddingTop="10" />
                <Button width="80%" :isEnabled="canStartTransfer" @tap="goToHelloAsso">
                    <Span :text="$t('next')" backgroundColor="transparent"></Span>
                    <Span :fontFamily="mdiFontFamily" backgroundColor="transparent" text="mdi-chevron-right" />
                </Button>
            </StackLayout>
            <AWebView
                ref="webView"
                :src="CREDIT_URL"
                :visibility="showHelloAsso ? 'visible' : 'hidden'"
                @loadStarted="onUrlLoadStarted"
                @loadFinished="onUrlLoadFinished"
            />
        </GridLayout>
    </CairnPage>
</template>

<script lang="ts" src="./CreditAccount.ts" />
