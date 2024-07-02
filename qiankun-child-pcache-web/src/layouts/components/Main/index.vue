<!--
 * @Author: yangmiaomiao
 * @Date: 2024-02-19 09:27:21
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-06-19 14:48:13
 * @Description: 
-->
<template>
    <Maximize v-if="maximize" />
    <Tabs v-if="tabs" />
    <Breadcrumb v-if="breadcrumb" id="breadcrumb" />
    <!-- isFirstBread="数据聚合" -->
    <el-main>
        <router-view v-slot="{ Component, route }">
            <transition appear name="fade-transform" mode="out-in">
                <keep-alive :include="keepAliveName">
                    <component :is="Component" v-if="isRouterShow" :key="route.fullPath" />
                </keep-alive>
            </transition>
        </router-view>
    </el-main>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, provide, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useDebounceFn } from '@vueuse/core'
import { useGlobalStore } from '@/stores/modules/global'
import { useKeepAliveStore } from '@/stores/modules/keepAlive'
import Maximize from '@/layouts/components/Header/components/Maximize.vue'
import Breadcrumb from '@/layouts/components/Header/components/Breadcrumb.vue'
import Tabs from '@/layouts/components/Tabs/index.vue'

const globalStore = useGlobalStore()
const { maximize, isCollapse, tabs, breadcrumb } = storeToRefs(globalStore)
const keepAliveStore = useKeepAliveStore()
const { keepAliveName } = storeToRefs(keepAliveStore)

// 注入刷新页面方法
const isRouterShow = ref(true)
const refreshCurrentPage = (val: boolean) => (isRouterShow.value = val)
provide('refresh', refreshCurrentPage)

// 监听当前页面是否最大化，动态添加 class
watch(
    () => maximize.value,
    () => {
        const app = document.getElementById('app') as HTMLElement
        if (maximize.value) {
            app.classList.add('main-maximize')
        } else {
            app.classList.remove('main-maximize')
        }
    },
    { immediate: true },
)

// 监听窗口大小变化，折叠侧边栏
const screenWidth = ref(0)
const listeningWindow = useDebounceFn(() => {
    screenWidth.value = document.body.clientWidth
    if (!isCollapse.value && screenWidth.value < 1200) globalStore.setGlobalState('isCollapse', true)
    if (isCollapse.value && screenWidth.value > 1200) globalStore.setGlobalState('isCollapse', false)
}, 100)
window.addEventListener('resize', listeningWindow, false)
onBeforeUnmount(() => {
    window.removeEventListener('resize', listeningWindow)
})
</script>

<style scoped lang="scss">
.el-main {
    padding-top: 0;
    background-color: var(--el-bg-color-page);
}
</style>
