<template>
    <GridLayout height="300" @shownInBottomSheet="onShownInBottomSheet()" backgroundColor="black">
        <BarcodeView ref="cameraView" pause beepOnScan="true" reportDuplicates="false" @scanResult="onScanResult($event)" formats="QR_CODE,EAN_13" />
        <!-- <Image src="~/images/crosshair.png" width="140" height="140" style="margin-top: 14; opacity: 0.3" horizontalAlignment="center" verticalAlignment="center" /> -->
        <Button variant="text" class="icon-btn" verticalAlignment="bottom" horizontalAlignment="left" text="mdi-flashlight" @tap="toggleTorch()" />
    </GridLayout>
</template>

<script src="./BarCodeBottomSheet.ts" />
