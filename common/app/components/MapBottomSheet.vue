<template>
        <GridLayout ref="bottomSheet" backgroundColor="white" elevation="1" :rows="rows">
            <!-- <transition name="fade" duration="200"> -->
                <ListItem v-if="!!item" :showBottomLine="false" :avatar="item.image" :title=" item.name" :subtitle="item.description" rightButton="mdi-chevron-right" @rightTap="showProfile(item)"/>
            <!-- </transition> -->

        </GridLayout>
</template>
<script lang="ts" src="./MapBottomSheet.ts"/>
