<template>
    <!-- <Frame> -->
        <CairnPage @navigatedTo="onLoaded" actionBarHidden backgroundColor="red">
            <GridLayout rows="3*,*,*,*,*" columns="*,*,*">
                <GridLayout columns="*,*,*,*" row="0" colSpan="3" orientation="horizontal" :backgroundColor="themeColor">
                    <Label
                        variant="none"
                        v-for="i in 4"
                        :key="i"
                        :ref="'field' + i"
                        borderRadius="4"
                        borderColor="black"
                        floating="false"
                        secure
                        height="100"
                        margin="0 10 0 10"
                        backgroundColor="white"
                        :col="i - 1"
                        fontSize="50"
                        textAlignment="center"
                        verticalTextAlignment="center"
                        isUserInteractionEnabled="false"
                        :text="((confirmingPassword ? passCodeConfirmationArray : passCodeArray)[i - 1]) !== undefined ? '•':' '"
                    />
                    <Label fontSize="18" paddingTop="30" fontWeight="bold" colSpan="4" textAlignment="center" color="white" verticalAlignment="top" :text="title" />
                    <Label fontSize="16" paddingBottom="30" fontWeight="bold" v-show="creation" colSpan="4" textAlignment="center" color="white" verticalAlignment="bottom" :text="message" />
                </GridLayout>
                <MDButton
                    variant="flat"
                    :row="j === 1 ? 4 : 1 + Math.floor((j - 2) / 3)"
                    :col="j === 1 ? 1 : (j - 2) % 3"
                    v-for="j in 10"
                    :key="'button' + j"
                    :ref="'button' + j"
                    :text="j - 1"
                    @tap="onButtonTap(j - 1)"
                    width="60"
                    height="60"
                    borderRadius="30"
                    :rippleColor="themeColor"
                    backgroundColor="transparent"
                    :color="themeColor"
                    fontSize="30"
                />
                <MDButton
                    variant="flat"
                    class="mdi"
                    row="4"
                    col="2"
                    text="mdi-close"
                    @tap="clear()"
                    width="60"
                    height="60"
                    borderRadius="30"
                    :rippleColor="themeColor"
                    backgroundColor="transparent"
                    :color="themeColor"
                    fontSize="30"
                />
            </GridLayout>
        </CairnPage>
    <!-- </Frame> -->
</template>

<script lang="ts" src="./PasscodeWindow.ts" />
a
