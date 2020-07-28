<template>
    <GridLayout
        :columns="`${16 * sizeFactor},auto,*,auto,${16 * sizeFactor}`"
        :rows="`${topBottomPadding * sizeFactor},auto,*,auto`"
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
            :color="iconColor"
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

        <StackLayout col="2" row="1" rowSpan="2" verticalAlignment="center">
            <Label col="2" row="1" :fontSize="10 * sizeFactor" v-show="!!overText" :text="overText | uppercase" verticalAlignment="center" :color="overlineColor" />
            <Label :fontSize="17 * sizeFactor" :text="title" textWrap="true" verticalTextAlignment="top"  maxLines="2" lineBreak="end" />
            <Label v-show="!!subtitle" :fontSize="14 * sizeFactor" :text="subtitle" verticalTextAlignment="top" :color="subtitleColor" :maxLines="subtitleMaxLines" lineBreak="end" />
        </StackLayout>

        <Label col="3" row="1" :fontSize="10 * sizeFactor" v-show="!!date" :text="date" verticalAlignment="top" />
        <GridLayout col="3" row="1" rowSpan="2" verticalAlignment="center" >
            <slot name="rightView">
                <Label v-show="!!rightIcon" class="mdi" :fontSize="24 * sizeFactor" textAlignment="right" :color="iconColor" :text="rightIcon" verticalAlignment="center" />
                <Button variant="flat" v-show="!!rightButton" class="icon-themed-btn" :text="rightButton" verticalAlignment="center" @tap="$emit('rightTap')" />
            </slot>
        </GridLayout>

        <AbsoluteLayout row="3" colSpan="5"  :marginTop="topBottomPadding * sizeFactor" marginLeft="20" :backgroundColor="listBorderColor" :height="!!showBottomLine ? 1 : 0" verticalAlignment="bottom" />
    </GridLayout>
</template>

<script lang="ts" src="./ListItem.ts"></script>
