<template>
    <CairnPage :title="$t('settings')">
        <ScrollView>
            <StackLayout>
                <SettingSwitchWithSubtitle
                    v-if="biometricsAvailable"
                    :title="$tc('biometric_lock')"
                    :subtitle="$tc('biometric_lock_desc')"
                    v-model="biometricsEnabled"
                />
                <SettingSwitchWithSubtitle :title="$tc('auto_lock')" :subtitle="$t('auto_lock_desc')" v-model="autoLockEnabled" />
                <ListItem :title="$tc('change_pin_code')" :subtitle="$t('change_pin_code_desc')" @tap="changePinCode" />
                <SettingSwitchWithSubtitle
                    :title="$tc('send_crash_reports')"
                    :subtitleMaxLines="0"
                    :subtitle="$tc('send_crash_reports_desc')"
                    v-model="sendCrashReports"
                />
                <StackLayout v-if="userSettings">
                    <Label paddingTop="20" class="list_section_title" :text="$tc('notifications')" />
                    <Label class="list_section_subtitle" :text="$tc('payment_notifications')" />
                    <Label class="list_section_subsubtitle" :text="$tc('payment_notifications_desc')" />
                    <SettingSwitch :title="$tc('push_notifications')" v-model="paymentNotifSettings.appPushEnabled" />
                    <SettingSwitch :title="$tc('mail_notifications')" v-model="paymentNotifSettings.emailEnabled" />
                    <SettingSwitch :title="$tc('webpush_notifications')" v-model="paymentNotifSettings.webPushEnabled" />
                    <Label paddingTop="20" class="list_section_subtitle" :text="$tc('newpro_notifications')" />
                    <Label class="list_section_subsubtitle" :text="$tc('newpro_notifications_desc')" />
                    <GridLayout columns="auto,*,auto" height="80" padding="5">
                        <Label verticalTextAlignment="center" fontSize="14" color="#676767" :text="$tc('distance')" />
                        <Slider
                            col="1"
                            maxValue="200"
                            :value="newproNotifSettings.radius"
                            @valueChange="newproNotifSettings.radius = Math.floor(parseFloat($event.value))"
                        />
                        <Label
                            verticalTextAlignment="center"
                            col="2"
                            fontSize="14"
                            color="#676767"
                            :text="newproNotifSettings.radius + ' km'"
                        />
                    </GridLayout>
                    <SettingSwitch :title="$tc('push_notifications')" v-model="newproNotifSettings.appPushEnabled" />
                    <SettingSwitch :title="$tc('webpush_notifications')" v-model="newproNotifSettings.webPushEnabled" />
                </StackLayout>
            </StackLayout>
        </ScrollView>
    </CairnPage>
</template>

<script lang="ts" src="./Settings.ts" />
