<template>
    <GridLayout columns="16,auto,*,auto,16" rows="5,auto,*,auto,5" backgroundColor="white">
        <Label v-if="!!leftIcon" col="1" row="0" rowSpan="5" fontSize="24" marginRight="16" textAlignment="left"  :text="leftIcon" horizontalAlignment="left" verticalAlignment="center" color="#757575" class="mdi" />
        <TextField col="2" row="2" fontSize="17" :text="title" :floatingLabel="overText" :hint="subtitle || overText" @textChange="$emit('textChange', $event)" @return="$emit('return', $event)"/>
        <!-- <Label col="2" row="1" fontSize="10" v-if="!!overText" :text="overText | uppercase" verticalAlignment="center" :color="overlineColor" /> -->
        <!-- <Label v-if="!!subtitle" col="2" row="3" fontSize="14" :text="subtitle" verticalAlignment="top" :color="subtitleColor" textWrap="true" /> -->
        <!-- <Label col="3" row="1" fontSize="14" :text="date" verticalAlignment="top" /> -->

        <!-- <MDRipple rowSpan="5" colSpan="5" @tap="$emit('tap', $event)" /> -->
        <Button variant="flat" col="3" row="2" rowSpan="1" v-if="!!rightButton" class="icon-themed-btn"  :text="rightButton" verticalAlignment="center" @tap="$emit('rightTap')"/>
        <!-- <AbsoluteLayout v-if="!!showBottomLine" row="4" colSpan="5" marginLeft="20" backgroundColor="#EFEFEF" height="1" verticalAlignment="bottom" /> -->
    </GridLayout>
</template>

<script lang="ts" src="./EditableListItem.ts">
</script>