<template>
    <CairnPage :title="$t('settings')">
        <ScrollView>
            <StackLayout>
                <ListItem v-if="biometricsAvailable" :title="$t('biometric_lock')" :subtitle="$t('biometric_lock_desc')">
                    <Switch slot="rightView" :ios:backgroundColor="accentColor" verticalAlignment="center"  v-model="biometricsEnabled"/>
                </ListItem>
                <ListItem :title="$t('auto_lock')" :subtitle="$t('auto_lock_desc')">
                    <Switch slot="rightView" :ios:backgroundColor="accentColor" verticalAlignment="center"  v-model="autoLockEnabled"/>
                </ListItem>
                <ListItem :title="$t('change_pin_code')" :subtitle="$t('change_pin_code_desc')" @tap="changePinCode"/>
            </StackLayout>
        </ScrollView>
    </CairnPage>
</template>

<script lang="ts" src="./Settings.ts" />
