import { Component, Prop, Watch } from 'vue-property-decorator';
import { convertDuration } from '~/helpers/formatter';
import BaseVueComponent from './BaseVueComponent';
import BottomSheetBase from './BottomSheet/BottomSheetBase';
import { BottomSheetHolderScrollEventData } from './BottomSheet/BottomSheetHolder';
import * as app from '@nativescript/core/application';
import { GridLayout } from '@nativescript/core/ui/layouts/grid-layout/grid-layout';
import { View } from '@nativescript/core/ui/core/view';
import { User } from '~/services/AuthService';
import Profile from '~/components/Profile';

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


    showProfile(item: User) {
        this.navigateTo(Profile, {
            props: {
                propUserProfile: item,
                editable: false
            }
        });
    }

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
}
