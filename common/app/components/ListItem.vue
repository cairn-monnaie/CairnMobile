<template>
    <GridLayout
        :columns="`${16 * sizeFactor},auto,*,auto,${16 * sizeFactor}`"
        :rows="`${12 * sizeFactor},auto,*,auto,${12 * sizeFactor}`"
        :rippleColor="themeColor"
        backgroundColor="white"
        @tap="$emit('tap', $event)"
    >
        <Label
            v-show="!!leftIcon"
            col="1"
            row="0"
            rowSpan="5"
            :fontSize="24 * sizeFactor"
            :marginRight="16 * sizeFactor"
            textAlignment="left"
            :text="leftIcon"
            horizontalAlignment="left"
            verticalAlignment="center"
            color="#757575"
            class="mdi"
        />
        <NSImg
            v-show="showAvatar"
            backgroundColor="gray"
            col="1"
            row="1"
            rowSpan="3"
            :width="40 * sizeFactor"
            :height="40 * sizeFactor"
            stretch="aspectFill"
            :marginRight="16 * sizeFactor"
            :src="avatar"
            verticalAlignment="center"
            :borderRadius="20 * sizeFactor"
            :android:roundAsCircle="true"
        />
        <Label col="2" row="1" :fontSize="10 * sizeFactor" v-show="!!overText" :text="overText | uppercase" verticalAlignment="center" :color="overlineColor" />

        <StackLayout col="2" row="2" verticalAlignment="center">
            <Label :fontSize="17 * sizeFactor" :text="title" textWrap="true" verticalTextAlignment="top"  maxLines="2" lineBreak="end" />
            <Label v-show="!!subtitle" :fontSize="14 * sizeFactor" :html="subtitle" verticalTextAlignment="top" :color="subtitleColor" maxLines="2" lineBreak="end" />
        </StackLayout>

        <Label col="3" row="1" :fontSize="10 * sizeFactor" v-show="!!date" :text="date" verticalAlignment="top" />
        <GridLayout col="3" row="1" rowSpan="3" verticalAlignment="center">
            <slot name="rightView">
                <Label v-show="!!rightIcon" class="mdi" :fontSize="24 * sizeFactor" textAlignment="right" color="#757575" :text="rightIcon" verticalAlignment="center" />
                <MDButton variant="flat" v-show="!!rightButton" class="icon-themed-btn" :text="rightButton" verticalAlignment="center" @tap="$emit('rightTap')" />
            </slot>
        </GridLayout>

        <AbsoluteLayout v-show="!!showBottomLine" row="4" colSpan="5" marginLeft="20" backgroundColor="#EFEFEF" height="1" verticalAlignment="bottom" />
    </GridLayout>
</template>

<script lang="ts" src="./ListItem.ts"></script>
