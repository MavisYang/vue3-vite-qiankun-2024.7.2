<!--
 * @Author: yangmiaomiao
 * @Date: 2024-02-04 15:44:58
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-02-21 10:25:00
 * @Description: 
-->
<template>
    <div class="collapse-view" @click="changeCollapse">
        <div class="unfold-view" v-if="globalStore.isCollapse">
            <el-icon class="collapse-icon">
                <component is="expand"></component>
            </el-icon>
        </div>
        <div class="fold-view" v-else>
            <span class="collapse-text">点击收起菜单</span>
            <el-icon class="collapse-icon">
                <component is="fold"></component>
            </el-icon>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from '@/stores/modules/global'

const globalStore = useGlobalStore()
const changeCollapse = () => globalStore.setGlobalState('isCollapse', !globalStore.isCollapse)
</script>

<style scoped lang="scss">
.collapse-view {
    width: 100%;
    line-height: 46px;
    cursor: pointer;
    border-top: 1px solid var(--el-border-color-light);
}
.fold-view {
    width: 210px;
}
.unfold-view {
    width: 65px;
}
.fold-view,
.unfold-view {
    height: 100%;
    padding: 0 20px;
    display: inline-flex;
    justify-content: flex-end;
    align-items: center;
    transition: all 0.2s ease;
}
.collapse-text {
    color: var(--el-menu-text-color);
    font-size: 13px;
    margin-right: 3px;
}
.collapse-icon {
    font-size: 22px;
    color: var(--el-menu-text-color);
    cursor: pointer;
    transition: transform 0.3s ease-in-out;
}
</style>
