<!--
 * @Author: yangmiaomiao
 * @Date: 2024-06-15 14:32:22
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-07-02 14:30:53
 * @FilePath: /qiankun-main-config-web/src/sidebar/index.vue
 * @Description: 
-->
<template>
    <el-aside>
        <div class="aside-box" :style="{ width: isCollapse ? '65px' : '210px' }">
            <el-scrollbar>
                <SidebarMenu :isCollapse="isCollapse" />
            </el-scrollbar>
            <CollapseIcon id="collapseIcon" :isCollapse="isCollapse" :changeCollapse="toggleSideBar" />
        </div>
    </el-aside>
</template>

<script setup>
import { computed } from 'vue'
import SidebarMenu from './components/SidebarMenu'
import CollapseIcon from './components/CollapseIcon'
import useGlobalStore from '@/stores/modules/global'

const globalStore = useGlobalStore()
const isCollapse = computed(() => globalStore.isCollapse)

const toggleSideBar = () => {
    globalStore.setGlobalState('isCollapse', !globalStore.isCollapse)
}
</script>

<style lang="scss" scoped>
.ep-aside {
    overflow: hidden;
    width: auto;
}
</style>
