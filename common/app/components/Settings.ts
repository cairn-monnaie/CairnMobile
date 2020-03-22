import { Component } from 'vue-property-decorator';
import PageComponent from '~/components/PageComponent';
import { ComponentIds } from './App';

@Component({
    components: {}
})
export default class Settings extends PageComponent {
    navigateUrl = ComponentIds.Settings;

    mounted() {
        super.mounted();
    }
    destroyed() {
        super.destroyed();
    }
}
