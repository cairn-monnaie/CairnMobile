import { Component, Prop, Watch } from 'vue-property-decorator';
import { convertDuration } from '~/helpers/formatter';
import BaseVueComponent from './BaseVueComponent';
import BottomSheetBase from './BottomSheet/BottomSheetBase';
import { BottomSheetHolderScrollEventData } from './BottomSheet/BottomSheetHolder';
import * as app from 'application';
import { GridLayout } from 'tns-core-modules/ui/layouts/grid-layout/grid-layout';
import { View } from 'tns-core-modules/ui/core/view';
import { User } from '~/services/AuthService';

function getViewTop(view: View) {
    if (gVars.isAndroid) {
        return (view.nativeView as android.view.View).getTop();
    } else {
        return (view.nativeView as UIView).frame.origin.y;
    }
}

@Component({
    components: {}
})
export default class MapBottomSheet extends BottomSheetBase {
    @Prop({
        default: () => [50]
    })
    steps;
    @Prop() item: User;

    // dataItems: any[] = [];
    // listVisible = false;
    // graphViewVisible = false;
    // _formatter: ItemFormatter;

    mounted() {
        super.mounted();
        // this.holder.$on('scroll', this.onScroll);
    }
    destroyed() {
        super.destroyed();
    }

    get bottomSheet() {
        return this.$refs['bottomSheet'] && (this.$refs['bottomSheet'].nativeView as GridLayout);
    }
    // get formatter() {
    //     if (!this._formatter && this.$getMapComponent()) {
    //         this._formatter = this.$getMapComponent().mapModule('formatter');
    //     }
    //     return this._formatter;
    // }

    get rows() {
        let result = '';
        this.steps.forEach((step, i) => {
            if (i === 0) {
                result += step;
            } else {
                result += ',' + (step - this.steps[i - 1]);
            }
        });
        // const result = this.steps.join(',');
        // this.log('rows', result);
        return result;
    }
    // get selectedIcon() {
    //     if (this.item) {
    //         return this.formatter.geItemIcon(this.item);
    //     }
    //     return [];
    // }

    // get selectedTitle() {
    //     if (this.item) {
    //         return this.formatter.getItemTitle(this.item);
    //     }
    // }
    // get selectedSubtitle() {
    //     if (this.item) {
    //         return this.formatter.getItemSubtitle(this.item);
    //     }
    // }
    // listViewAvailable = false;
    // get listViewAvailable() {
    //     return !!this.item && !!this.item.route && !!this.item.route.instructions;
    // }
    // get showListView() {
    //     return this.listViewAvailable && this.listVisible;
    // }
    // graphAvailable = false;
    // get graphAvailable() {
    //     return this.itemRoute && !!this.item.route.profile && !!this.item.route.profile.data && this.item.route.profile.data.length > 0;
    // }

    // @Watch('item')
    // onSelectedItemChange(item: User) {
    //     this.log('onSelectedItemChange', !!item);
    //     this.listVisible = false;
    //     this.listViewAvailable = !!this.item && !!this.item.route && !!this.item.route.instructions;

    //     this.graphViewVisible = false;
    //     this.graphAvailable = this.itemIsRoute && !!this.item.route.profile && !!this.item.route.profile.data && this.item.route.profile.data.length > 0;

    //     // if (item && item.route) {
    //     //     this.dataItems = item.route.instructions;
    //     // } else {
    //     //     // this.dataItems = [];
    //     // }
    // }
    // onScroll(e: BottomSheetHolderScrollEventData) {
    //     // this.log('onScroll', this.listViewAvailable, this.listVisible, e.height);
    //     if (this.listViewAvailable && !this.listVisible) {
    //         const locationY = getViewTop(this.listView);
    //         // this.log('listViewAvailable locationY', locationY);
    //         if (locationY) {
    //             const listViewTop = locationY;
    //             if (!this.listVisible && e.height > listViewTop) {
    //                 // this.log('set listVisible', listViewTop, e.height);
    //                 this.listVisible = true;
    //             }
    //             if (this.listVisible && !this.isListViewAtTop && e.height < listViewTop) {
    //                 this.log('resetting listViewAtTop to ensure pan enabled');
    //                 this.listViewAtTop = true;
    //                 this.listView.scrollToIndex(0, false);
    //             }
    //         }
    //     }
    //     if (this.graphAvailable && !this.graphViewVisible) {
    //         const locationY = getViewTop(this.graphView);
    //         // this.log('graphAvailable locationY', locationY);
    //         if (locationY) {
    //             const graphViewTop = locationY;
    //             if (!this.graphViewVisible && e.height > graphViewTop) {
    //                 // this.log('set graphViewVisible', graphViewTop, e.height);
    //                 this.graphViewVisible = true;
    //             }
    //         }
    //     }
    // }
    // searchItemWeb() {
    //     if (gVars.isAndroid) {
    //         const query = this.$getMapComponent()
    //             .mapModule('formatter')
    //             .getItemName(this.item);
    //         console.log('searchItemWeb', this.item, query);
    //         const intent = new android.content.Intent(android.content.Intent.ACTION_WEB_SEARCH);
    //         intent.putExtra(android.app.SearchManager.QUERY, query); // query contains search string
    //         (app.android.foregroundActivity as android.app.Activity).startActivity(intent);
    //     }
    // }
    // getProfile() {
    //     this.$networkService
    //         .mapquestElevationProfile(this.item.route.positions)
    //         .then(result => {
    //             this.item.route.profile = result;
    //         })
    //         .then(() => this.updateItem(false))
    //         .then(() => {
    //             // make sure the graph is visible
    //             this.holder.scrollSheetToPosition(this.holder.peekerSteps[2]);

    //         });
    // }
    // saveItem() {
    //     const mapComp = this.$getMapComponent();
    //     mapComp
    //         .mapModule('items')
    //         .saveItem(this.item)
    //         .then(item => {
    //             mapComp.selectItem(item, true);
    //         })
    //         .catch(err => {
    //             this.showError(err);
    //         });
    // }
    // updateItem(peek = true) {
    //     const mapComp = this.$getMapComponent();
    //     mapComp
    //         .mapModule('items')
    //         .updateItem(this.item)
    //         .then(item => {
    //             mapComp.selectItem(item, true, peek);
    //         })
    //         .catch(err => {
    //             this.showError(err);
    //         });
    // }
    // deleteItem() {
    //     const mapComp = this.$getMapComponent();
    //     mapComp.mapModule('items').deleteItem(this.item);
    // }

    // getRouteInstructionIcon(item: any) {
    //     return [];
    // }
    // getRouteInstructionTitle(item: RouteInstruction) {
    //     return item.action;
    // }
    // getRouteInstructionSubtitle(item: RouteInstruction) {
    //     return item.streetName;
    // }

    // get routeElevationProfile() {
    //     this.log('routeElevationProfile', this.graphViewVisible, !!this.item, !!this.item && !!this.item.route, !!this.item && !!this.item.route && !!this.item.route.profile);
    //     if (this.graphViewVisible) {
    //         const profile = this.item.route.profile;
    //         return profile ? profile.data : null;
    //     }
    //     return null;
    // }
    // get routeInstructions() {
    //     if (this.listVisible) {
    //         // const profile = this.item.route.profile;
    //         return this.item.route.instructions;
    //     }
    //     return [];
    // }
}
