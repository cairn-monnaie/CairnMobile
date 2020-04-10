<template>
    <CairnPage :title="$t('settings')">
        <ScrollView>
            <StackLayout>
                <ListItem v-if="biometricsAvailable" :title="$t('biometric_lock')" :subtitle="$t('biometric_lock_desc')">
                    <Switch slot="rightView" verticalAlignment="center" v-model="biometricsEnabled" />
                </ListItem>
                <ListItem :title="$t('auto_lock')" :subtitle="$t('auto_lock_desc')">
                    <Switch slot="rightView" verticalAlignment="center" v-model="autoLockEnabled" />
                </ListItem>
                <ListItem :title="$t('change_pin_code')" :subtitle="$t('change_pin_code_desc')" @tap="changePinCode" />
                <ListItem :title="$t('send_crash_reports')" subtitleMaxLines="0" :subtitle="$t('send_crash_reports_desc')">
                    <Switch slot="rightView" verticalAlignment="center" v-model="sendCrashReports" />
                </ListItem>
            </StackLayout>
        </ScrollView>
    </CairnPage>
</template>

<script lang="ts" src="./Settings.ts" />
