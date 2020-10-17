<template>
    <!-- <Frame> -->
    <CairnPage actionBarHidden backgroundColor="transparent">
        <GridLayout :backgroundColor="themeColor">
            <Button variant="text" color="white" class="icon-btn" text="mdi-close" @tap="close()" horizontalAlignment="left" verticalAlignment="top" />
            <StackLayout horizontalAlignment="center" marginTop="40" widhth="80%">
                <GridLayout width="160" height="160" borderRadius="80" backgroundColor="white" horizontalAlignment="center">
                    <NSImg :src="recipient.image" stretch="aspectFill" width="140" height="140" borderRadius="70" />
                </GridLayout>

                <Label textAlignment="center" :text="recipient.name" fontSize="30" color="white" />
                <Label class="mdi" text="mdi-check" fontSize="100" horizontalAlignment="center" color="green" />

                <Label horizontalAlignment="center" fontSize="50" color="white">
                    <Span :text="amount | currency"></Span>
                    <Span :fontFamily="cairnFontFamily" text="cairn-currency" />
                </Label>
            </StackLayout>
        </GridLayout>
    </CairnPage>
    <!-- </Frame> -->
</template>

<script lang="ts" src="./TransferConfirmation.ts" />
