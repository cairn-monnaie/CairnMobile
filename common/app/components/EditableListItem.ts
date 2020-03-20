import { Component, Prop } from 'vue-property-decorator';
import ListItem from '~/components/ListItem';

@Component({
    inheritAttrs: false
})
export default class EditableListItem extends ListItem {
    mounted() {
        super.mounted();
    }
    destroyed() {
        super.destroyed();
    }

    // get height() {
    //     if (this.leftIcon) {
    //         return 72;
    //     }
    // }
}
