import { Component } from 'vue-property-decorator';
import ListItem from './ListItem';

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
}
