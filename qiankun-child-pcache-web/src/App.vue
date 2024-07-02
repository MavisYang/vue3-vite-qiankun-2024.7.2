<!--
 * @Author: yangmiaomiao
 * @Date: 2024-05-27 11:18:35
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-07-01 11:11:54
 * @Description: 
-->
<template>
    <el-config-provider :locale="locale" :button="buttonConfig">
        <router-view />
    </el-config-provider>
</template>

<script setup lang="ts">
import { onMounted, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getBrowserLang } from '@/utils'
import { ElConfigProvider } from 'element-plus'
import { LanguageType } from './stores/interface'
import { useGlobalStore } from '@/stores/modules/global'
import en from 'element-plus/es/locale/lang/en'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { useTheme } from '@/hooks/useTheme'
const globalStore = useGlobalStore()

// init theme
const { initTheme } = useTheme()
initTheme()

// init language
const i18n = useI18n()
onMounted(() => {
    const language = globalStore.language ?? getBrowserLang()
    i18n.locale.value = language
    globalStore.setGlobalState('language', language as LanguageType)
})
// element language
const locale = computed(() => {
    if (globalStore.language == 'zh') return zhCn
    if (globalStore.language == 'en') return en
    return getBrowserLang() == 'zh' ? zhCn : en
})

// element button config
const buttonConfig = reactive({ autoInsertSpace: false })
</script>
