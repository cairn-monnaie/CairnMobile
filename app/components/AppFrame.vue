<template>
    <GridLayout>
        <Frame v-if="loggedIn" key="default">
            <slot />
        </Frame>
        <Frame v-else id="authFrame" key="auth">
            <Login />
        </Frame>
    </GridLayout>
</template>

<script src="./AppFrame.ts" />