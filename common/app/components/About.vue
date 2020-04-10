<template>
    <CairnPage :title="$t('about')">
        <ScrollView>
            <StackLayout>
                <ListItem :title="$t('version')" :subtitle="appVersion" />
                <ListItem :title="$t('source_code')" :subtitle="$t('source_code_desc')" rightIcon="mdi-chevron-right" @tap="onTap('github')" />
                <ListItem :title="$t('third_party_software')" :subtitle="$t('third_party_software_desc')" rightIcon="mdi-chevron-right" @tap="onTap('third_party')" />
                <ListItem :title="$t('terms_and_conditions')" :subtitle="$t('terms_and_conditions_desc')" rightIcon="mdi-chevron-right" @tap="onTap('terms')" />
                <ListItem :title="$t('privacy_policy')" :subtitle="$t('privacy_policy_desc')" rightIcon="mdi-chevron-right" @tap="onTap('privacy')" />
                <ListItem :title="$t('support')" :subtitle="$t('support_desc')" rightIcon="mdi-chevron-right" @tap="onTap('support')" />
                <ListItem :title="$t('share_app')" rightIcon="mdi-chevron-right" @tap="onTap('share')" />
                <ListItem :title="$t('review_app')" rightIcon="mdi-chevron-right" @tap="onTap('review')" />
            </StackLayout>
        </ScrollView>
    </CairnPage>
</template>

<script lang="ts" src="./About.ts" />
