<template>
    <MDCardView borderRadius="0" elevation="1" rippleColor="transparent">
        <GridLayout ref="bottomSheet" backgroundColor="white" :rows="rows">
            <transition name="fade" duration="200">
                <ListItem v-if="!!item" showBottomLine="false" :avatar="item.image" :title=" item.name" :subtitle="item.email" />
            </transition>

        </GridLayout>
    </MDCardView>
</template>
<script lang="ts" src="./MapBottomSheet.ts"/>
