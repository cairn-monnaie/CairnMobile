<template>
<GridLayout columns="16,auto,*,auto,16" rows="5,auto,*,auto,5" backgroundColor="white">
    <Label v-if="!!leftIcon" col="1" row="0" rowSpan="5" fontSize="24" marginRight="16" textAlignment="left"  :text="leftIcon" horizontalAlignment="left" verticalAlignment="center" color="${iconColor}" class="mdi" />
    <TextField col="2" row="2" fontSize="17" :text="title" :floatingLabel="overText" :hint="subtitle || overText" @textChange="$emit('textChange', $event)" @return="$emit('return', $event)"/>
    <Button variant="flat" col="3" row="2" rowSpan="1" v-if="!!rightButton" class="icon-themed-btn"  :text="rightButton" verticalAlignment="center" @tap="$emit('rightTap')"/>
</GridLayout>
</template>
<script lang="ts" src="./EditableListItem.ts"/>
