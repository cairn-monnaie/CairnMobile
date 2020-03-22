import { throttle } from 'helpful-decorators';
import { ClickType, MapBounds, MapPos } from 'nativescript-carto/core';
import { GeoJSONVectorTileDataSource } from 'nativescript-carto/datasources';
import { HTTPTileDataSource } from 'nativescript-carto/datasources/http';
import { VectorTileEventData, VectorTileLayer } from 'nativescript-carto/layers/vector';
import { CartoMap } from 'nativescript-carto/ui';
import { MBVectorTileDecoder } from 'nativescript-carto/vectortiles';
import * as appSettings from '@nativescript/core/application-settings';
import { Component } from 'vue-property-decorator';
import PageComponent from '~/components/PageComponent';
import { User } from '~/services/AuthService';
import { ComponentIds } from './App';
import BottomSheetHolder, { BottomSheetHolderScrollEventData } from './BottomSheet/BottomSheetHolder';
import MapBottomSheet from './MapBottomSheet';
import MapComponent from './MapComponent';
const GeoJSON = require('geojson');

@Component({
    components: {
        MapComponent,
        MapBottomSheet,
        BottomSheetHolder
    }
})
export default class Map extends PageComponent {
    navigateUrl = ComponentIds.Map;
    _cartoMap: CartoMap;
    _localVectorTileDataSource: GeoJSONVectorTileDataSource;
    localVectorTileLayer: VectorTileLayer;
    currentBounds: MapBounds;
    selectedItem: User = null;

    bottomSheetTranslation = 0;
    bottomSheetPercentage = 0;
    get scrollingWidgetsOpacity() {
        if (this.bottomSheetPercentage <= 0.5) {
            return 1;
        }
        return 4 * (2 - 2 * this.bottomSheetPercentage) - 3;
    }
    onBottomSheetScroll(e: BottomSheetHolderScrollEventData) {
        // console.log('onBottomSheetScroll', e);
        this.bottomSheetTranslation = e.height;
        this.bottomSheetPercentage = e.percentage;
    }

    get bottomSheetSteps() {
        const result = [70];

        return result;
    }
    get bottomSheetHolder() {
        return this.$refs['bottomSheetHolder'] as BottomSheetHolder;
    }

    get mapComp() {
        return this.$refs['mapComp'] as MapComponent;
    }

    get bottomSheet() {
        return this.bottomSheetHolder.bottomSheet;
    }
    get cartoMap() {
        return this.mapComp.cartoMap;
    }
    mounted() {
        super.mounted();
    }
    destroyed() {
        super.destroyed();
    }
    // map: Mapbox;
    onMapReady(e) {
        const map = (this._cartoMap = e.object as CartoMap);
        // this.refresh();
        const pos = JSON.parse(appSettings.getString('mapFocusPos', '{"latitude":45.2002,"longitude":5.7222}')) as MapPos;
        const zoom = appSettings.getNumber('mapZoom', 10);
        console.log('map start pos', pos, zoom);
        map.setFocusPos(pos, 0);
        map.setZoom(zoom, 0);
    }

    @throttle(100)
    saveSettings() {
        if (!this._cartoMap) {
            return;
        }
        const cartoMap = this._cartoMap;
        appSettings.setNumber('mapZoom', cartoMap.zoom);
        appSettings.setString('mapFocusPos', JSON.stringify(cartoMap.focusPos));
    }

    onMapStable(e) {
        if (this.ignoreStable) {
            this.ignoreStable = false;
            return;
        }
        this.saveSettings();
        const map = e.object as CartoMap;
        const currentBounds = new MapBounds(map.screenToMap({ x: this.nativeView.getMeasuredWidth(), y: 0 }), map.screenToMap({ x: 0, y: this.nativeView.getMeasuredHeight() }));
        // console.log('onMapStable', this.currentBounds, currentBounds);
        if (!this.currentBounds || !currentBounds.equals(this.currentBounds)) {
            this.currentBounds = currentBounds;
            this.refresh(currentBounds);
        }
    }

    get localVectorTileDataSource() {
        if (!this._localVectorTileDataSource && this._cartoMap) {
            this._localVectorTileDataSource = new GeoJSONVectorTileDataSource({
                minZoom: 0,
                maxZoom: 24
            });
            const result = this._localVectorTileDataSource.createLayer('cairn');
            // console.log('addLayer', result);
        }
        return this._localVectorTileDataSource;
    }
    onElementClick(...args) {
        this.log('onElementClick', args);
    }
    getOrCreateLocalVectorLayer() {
        if (!this.localVectorTileLayer && this._cartoMap) {
            const decoder =  new MBVectorTileDecoder({
                style: 'voyager',
                liveReload: TNS_ENV !== 'production',
                dirPath: '~/assets/styles/cairn'
            });
            this.localVectorTileLayer = new VectorTileLayer({
                preloading: true,

                dataSource: this.localVectorTileDataSource,
                decoder
            });

            this.localVectorTileLayer.setVectorTileEventListener(this, this._cartoMap.projection);
            // always add it at 1 to respect local order
            this._cartoMap.addLayer(this.localVectorTileLayer);

            // const testLayer = new VectorTileLayer({
            //     dataSource: new HTTPTileDataSource({
            //         url:'http://localhost:8080/data/contours/{z}/{x}/{y}.pbf',
            //         minZoom: 9,
            //         maxZoom: 14
            //     }),
            //     decoder
            // });
            // this._cartoMap.addLayer(testLayer);
        }
        return this.localVectorTileLayer;
    }
    onVectorTileClicked(data: VectorTileEventData) {
        const { clickType, position, featureLayerName, featureData, featurePosition } = data;
        if (clickType === ClickType.SINGLE) {
            // const map = this._cartoMap;
            const user = this.shownUsers.find(u => u.id === (featureData.id as any));
            if (user) {
                this.selectItem(user);
            }
        }
        return true;
    }
    ignoreStable = false;
    shownUsers: User[] = [];
    @throttle(1000)
    refresh(mapBounds: MapBounds) {
        console.log('refresh', mapBounds);

        // console.log("refreshing")
        this.loading = true;
        this.$authService
            .getUserForMap(mapBounds)
            .then(r => {
                console.log('received', r.length, 'users for map');
                this.shownUsers = r;
                if (r.length > 0) {
                    const geojson = GeoJSON.parse(r, { Point: ['address.latitude', 'address.longitude'], include: ['name', 'id'] });
                    // const projection = this._cartoMap.projection;
                    // const reader = new GeoJSONGeometryReader({
                    //     targetProjection: projection
                    // });
                    // public readFeatureCollection(param0: string): com.carto.geometry.FeatureCollection;

                    this.getOrCreateLocalVectorLayer();
                    this.ignoreStable = true;
                    // const features = reader.readFeatureCollection(JSON.stringify(geojson));
                    // const feature =  features.getFeature(0);
                    // this.log('refresh result', r.length, geojson, features.getFeatureCount(), feature.properties, fromNativeMapPos(feature.geometry.getCenterPos()));
                    // this.localVectorDataSource.setLayerFeatureCollection(1, projection, features);
                    this.localVectorTileDataSource.setLayerGeoJSON(1, geojson);
                }

            })
            .catch(this.showError).finally(()=>{
                this.loading = false;
            });
    }
    selectItem(item: User) {
        this.log('selectItem', item);
        this.selectedItem = item;
        // if (item.zoomBounds) {
        //     const zoomLevel = getBoundsZoomLevel(item.zoomBounds, { width: screen.mainScreen.widthPixels, height: screen.mainScreen.heightPixels });
        //     this.cartoMap.setZoom(zoomLevel, getCenter(item.zoomBounds.northeast, item.zoomBounds.southwest), 200);
        // } else {
        this.cartoMap.setFocusPos(item.address, 200);
        this.localVectorTileLayer.getTileDecoder().setStyleParameter('selected_id', item.id + '');
        // }
        this.bottomSheetHolder.peek();
    }
    unselectItem() {
        this.log('unselectItem', !!this.selectedItem);
        if (!!this.selectedItem) {
            this.selectedItem = null;
            this.localVectorTileLayer.getTileDecoder().setStyleParameter('selected_id', '');

            this.bottomSheetHolder.close();
        }
    }
    askUserLocation() {
        return this.mapComp.askUserLocation();
    }
    // onUpdateSessionEvent(e: SessionEventData) {
    //     this.onUpdateSession(e.data);
    // }

    // onServiceLoaded(bluetoothHandler: BluetoothHandler, geoHandler: GeoHandler) {
    //     this.geoHandlerOn(SessionUpdatedEvent, this.onUpdateSessionEvent);
    //     this.onUpdateSession(geoHandler.getCurrentSession());
    // }
}
