import { ClickType, MapBounds, MapPos } from '@nativescript-community/ui-carto/core';
import { VectorTileEventData } from '@nativescript-community/ui-carto/layers/vector';
import { CartoMap } from '@nativescript-community/ui-carto/ui';
import * as appSettings from '@nativescript/core/application-settings';
import { throttle } from 'helpful-decorators';
import { Component, Prop } from 'vue-property-decorator';
import { User } from '../services/AuthService';
import BaseVueComponent from './BaseVueComponent';
import BottomSheetHolder, { BottomSheetHolderScrollEventData } from './BottomSheet/BottomSheetHolder';
import FilterCategories from './FilterCategories';
import MapBottomSheet from './MapBottomSheet';
import MapComponent from './MapComponent';

let categories = null;

@Component({
    components: {
        MapComponent,
        MapBottomSheet,
        BottomSheetHolder
    }
})
export default class InteractiveMap extends BaseVueComponent {
    _cartoMap: CartoMap;
    currentBounds: MapBounds;
    selectedItem: User = null;

    bottomSheetTranslation = 0;
    bottomSheetPercentage = 0;
    shownUsers: User[] = [];
    loading = false;
    mapCategories = [];
    mapFilterSlugs: string[] = [];

    @Prop({ default: 1 }) opacity: number;

    get scrollingWidgetsOpacity() {
        if (this.bottomSheetPercentage <= 0.5) {
            return 1;
        }
        return 4 * (2 - 2 * this.bottomSheetPercentage) - 3;
    }
    onBottomSheetScroll(e: BottomSheetHolderScrollEventData) {
        this.bottomSheetTranslation = e.height;
        this.bottomSheetPercentage = e.percentage;
    }

    get bottomSheetSteps() {
        const result = [80];

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
        this.mapCategories = categories;
        this.mapFilterSlugs = [];
        if (!this.mapCategories) {
            this.$authService.categories().then(r => {
                this.mapCategories = categories = r;
            });
        }
    }
    destroyed() {
        super.destroyed();
    }
    // map: Mapbox;
    onMapReady(e) {
        const map = (this._cartoMap = e.object as CartoMap);
        const pos = JSON.parse(appSettings.getString('mapFocusPos') || '{"latitude":45.2002,"longitude":5.7222}') as MapPos;
        const zoom = appSettings.getNumber('mapZoom', 10);
        if (pos) {
            map.setFocusPos(pos, 0);
            map.setZoom(zoom, 0);
        }
    }
    onLayoutChange() {
        // sometimes onMapStable is not called at first so we need this
        // to make sure the map refreshes
        if (!this.currentBounds && this._cartoMap) {
            // we need to delay a bit or the map wont have its size
            setTimeout(() => {
                const map = this._cartoMap;
                this.currentBounds = new MapBounds(map.screenToMap({ x: this.nativeView.getMeasuredWidth(), y: 0 }), map.screenToMap({ x: 0, y: this.nativeView.getMeasuredHeight() }));
                this.refresh(this.currentBounds);
            }, 10);
        }
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
        // this.log('onMapStable', !!this._cartoMap, !!this.currentBounds);
        this.saveSettings();
        const map = e.object as CartoMap;
        const currentBounds = new MapBounds(map.screenToMap({ x: this.nativeView.getMeasuredWidth(), y: 0 }), map.screenToMap({ x: 0, y: this.nativeView.getMeasuredHeight() }));
        // console.log('onMapStable', currentBounds);
        if (!this.currentBounds || !currentBounds.equals(this.currentBounds)) {
            this.currentBounds = currentBounds;
            this.refresh(currentBounds);
        }
    }

    onElementClick(...args) {
    }

    onVectorTileClicked(data: VectorTileEventData) {
        // this.log('onVectorTileClicked', data);
        const { clickType, position, featureLayerName, featureData, featurePosition } = data;
        if (clickType === ClickType.SINGLE) {
            // const map = this._cartoMap;
            const user = this.shownUsers.find(u => u.id + '' === (featureData.id as any));
            if (user === this.selectedItem) {
                return false;
            } else if (user) {
                this.selectItem(user);
            } else {
                this.unselectItem();
            }
        }
        return true;
    }
    @throttle(2000)
    refresh(mapBounds: MapBounds) {
        // console.log('refresh', this._cartoMap.zoom, mapBounds, this.mapFilterSlugs);
        this.loading = true;
        this.$authService
            .getUsersForMap(mapBounds, this.mapFilterSlugs)
            .then(r => {
                // console.log('received', r.length, 'users for map');
                this.shownUsers = r;
                if (r.length > 0) {
                    // const geojson = GeoJSON.parse(r, { Point: ['address.latitude', 'address.longitude'], include: ['name', 'id'] });
                    this.mapComp.addGeoJSONPoints(r);
                    // this.ignoreStable = true;
                    // this.mapComp.localVectorTileDataSource.setLayerGeoJSON(1, geojson);
                }
            })
            .catch(this.showError)
            .finally(() => {
                this.loading = false;
            });
    }
    selectItem(item: User) {
        this.selectedItem = item;
        this.cartoMap.setFocusPos(item.address, 200);
        this.mapComp.localVectorTileLayer.getTileDecoder().setStyleParameter('selected_id', item.id + '');
        this.bottomSheetHolder.peek();
    }
    async unselectItem() {
        if (!!this.selectedItem) {
            this.mapComp.localVectorTileLayer.getTileDecoder().setStyleParameter('selected_id', '');

            await this.bottomSheetHolder.close();
            this.selectedItem = null;
        }
    }
    askUserLocation() {
        return this.mapComp.askUserLocation();
    }

    selectCategories() {
        if (this.mapCategories) {
            this.$showBottomSheet(FilterCategories, {
                closeCallback: () => {
                    this.refresh(this.currentBounds);
                },
                ignoreTopSafeArea: true,
                trackingScrollView: 'trackingScrollView',
                props: {
                    categories: this.mapCategories,
                    filterSlugs: this.mapFilterSlugs
                }
            });
        }
    }
}
