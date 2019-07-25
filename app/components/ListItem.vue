<template>
    <GridLayout columns="16,auto,*,auto,16" rows="16,auto,*,auto,16" backgroundColor="white">
        <Label v-if="!!leftIcon" col="1" row="0" rowSpan="5" fontSize="24" width="40" textAlignment="left" height="40" :text="leftIcon | fonticon" horizontalAlignment="center" verticalAlignment="center" color="#757575" class="mdi" />
        <Img v-if="!!avatar" col="1" row="0" rowSpan="5" fontSize="24" width="40" height="40" :src="avatar" horizontalAlignment="center" verticalAlignment="center" />
        
        <Label col="2" row="2" fontSize="17" :text="title" textWrap="true" />
        <Label col="2" row="1" fontSize="10" v-if="!!overText" :text="overText | uppercase" verticalAlignment="center" :color="overlineColor" />
        <Label v-if="!!subtitle" col="2" row="3" fontSize="14" :text="subtitle" verticalAlignment="top" :color="subtitleColor" textWrap="true" />
        <Label col="3" row="1" fontSize="14" :text="date" verticalAlignment="top" />
        <Label col="3" row="1" rowSpan="3" v-if="!!rightIcon" class="icon-btn" textAlignment="right" color="#757575" :text="rightIcon | fonticon" verticalAlignment="center" />
        <MDRipple rowSpan="5" colSpan="5" @tap="$emit('tap', $event)" />
        <MDButton variant="flat" col="3" row="1" rowSpan="3" v-if="!!rightButton" class="icon-themed-btn"  :text="rightButton | fonticon" verticalAlignment="center" @tap="$emit('rightTap')"/>
        <AbsoluteLayout v-if="!!showBottomLine" row="4" colSpan="5" marginLeft="20" backgroundColor="#EFEFEF" height="1" verticalAlignment="bottom" />
    </GridLayout>
</template>

<script lang="ts" src="./ListItem.ts">
</script>