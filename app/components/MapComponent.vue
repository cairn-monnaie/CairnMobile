<template>
    <GridLayout>
        <CartoMap ref="mapView" zoom="16" @mapReady="onMapReady" @mapMoved="onMapMove" @mapStable="onMapStable" />
        <!-- <MDButton v-if="showLocationButton" @tap="askUserLocation" class="floating-btn" margin="8" text="mdi-crosshairs-gps" horizontalAlignment="right" verticalAlignment="bottom" /> -->
    </GridLayout>
</template>

<script lang="ts" src="./MapComponent.ts"/>