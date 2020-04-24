<template>
    <CairnPage :title="$t('about')">
        <ScrollView>
            <StackLayout>
                <SettingLabelIcon :title="$tc('version')" :subtitle="appVersion" />
                <SettingLabelIcon :title="$tc('source_code')" :subtitle="$tc('source_code_desc')" rightIcon="mdi-chevron-right" @tap="onTap('github')" />
                <SettingLabelIcon :title="$tc('third_party_software')" :subtitle="$tc('third_party_software_desc')" icon="mdi-chevron-right" @tap="onTap('third_party')" />
                <SettingLabelIcon :title="$tc('terms_and_conditions')" :subtitle="$tc('terms_and_conditions_desc')" icon="mdi-chevron-right" @tap="onTap('terms')" />
                <SettingLabelIcon :title="$tc('privacy_policy')" :subtitle="$tc('privacy_policy_desc')" icon="mdi-chevron-right" @tap="onTap('privacy')" />
                <SettingLabelIcon :title="$tc('support')" :subtitle="$tc('support_desc')" icon="mdi-chevron-right" @tap="onTap('support')" />
                <SettingLabelIcon :title="$tc('share_app')" icon="mdi-chevron-right" @tap="onTap('share')" />
                <SettingLabelIcon :title="$tc('review_app')" icon="mdi-chevron-right" @tap="onTap('review')" />
            </StackLayout>
        </ScrollView>
    </CairnPage>
</template>

<script lang="ts" src="./About.ts" />
