import { openUrl } from '@nativescript/core/utils/utils';
import { Component } from 'vue-property-decorator';
import BaseVueComponent from './BaseVueComponent';

const licences = require(`~/licenses.json`);

@Component
export default class ThirdPartySoftwareBottomSheet extends BaseVueComponent {
    dataItems: {
        moduleName: string;
        moduleUrl: string;
        moduleLicense: string;
    }[] = licences.dependencies;
    mounted() {
        super.mounted();
    }
    destroyed() {
        super.destroyed();
    }
    onShownInBottomSheet() {}
    onTap(item) {
        if (item.moduleUrl) {
            openUrl(item.moduleUrl);
        }
    }
}
