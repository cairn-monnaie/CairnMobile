<template>
    <CairnPage
        @navigatedTo="onNavigatedTo"
        showMenuIcon
        @loaded="onLoaded"
        mdiAction="cairn-currency"
        actionBarHidden
        :bottomActionBarHidden="false"
        mdiActionClass="cairn"
        :mdiActionFontSize="40"
        @actionTap="openTransferWindow"
    >
        <StackLayout>
            <Pager :items="users" height="30%" :backgroundColor="themeColor">
                <v-template>
                    <GridLayout rows="*" columns="*">
                        <!-- <MapComponent v-show="item.address && item.address.latitude" rowSpan="4" opacity="0.5" /> -->
                        <NSImg stretch="center" :src="item.image || DEFAULT_IMAGE_URL" width="100%" height="100%" backgroundColor="#E86A45" />
                        <Label
                            textAlignment="left"
                            verticalAlignment="bottom"
                            class="bottom-gradient"
                            padding="10 10 10 10"
                            fontSize="14"
                            color="white"
                            :html="`<big><b>${item.name}</b></big><br>${item.description}<br> ${formatAddress(item.address)}`"
                        />
                    </GridLayout>
                </v-template>
            </Pager>
            <PullToRefresh height="70%" @refresh="refresh">
                <CollectionView :items="accounts" rowHeight="180">
                    <v-template>
                        <StackLayout>
                            <GridLayout class="cardView" margin="20" padding="10" columns="*, auto" rows="auto, *" @tap="onItemTap(item)">
                                <Label row="0" :text="item.name | capitalize" fontWeight="bold" fontSize="18" />
                                <Label row="1" class="balance"  paddingTop="20">
                                    <Span :text="item.balance | currency(true)" />
                                    <Span :fontFamily="cairnFontFamily" text="cairn-currency" />
                                </Label>
                                <Label col="1" rowSpan="2" class="mdi" text="mdi-chevron-right" fontSize="30" color="gray" verticalAlignment="center" />
                            </GridLayout>
                        </StackLayout>
                    </v-template>
                </CollectionView>
            </PullToRefresh>
            <!-- <Fab colSpan="3" rowSpan="3" iconClass="mdi" icon="mdi-plus" iconOn="mdi-close" :backgroundColor="accentColor" color="white" paddingTop='-60'>
                <FabItem :title="$t('transfer') | capitalize" iconClass="mdi" icon="mdi-bank-transfer" @tap="openTransferWindow" />
                <FabItem :title="$t('add_beneficiary') | capitalize" iconClass="mdi" icon="mdi-account-plus" @tap="addBeneficiary" />
            </Fab> -->
        </StackLayout>
        <StackLayout slot="bottomActionBarRightButtons" verticalAlignment="center" orientation="horizontal">
            <MDButton variant="flat" class="icon-btn" text="mdi-qrcode-scan" @tap="scanQRCode" />
        </StackLayout>
    </CairnPage>
</template>

<script lang="ts" src="./Home.ts" />
