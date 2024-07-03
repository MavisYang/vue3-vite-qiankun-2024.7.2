<!--
 * @Author: yangmiaomiao
 * @Date: 2024-02-04 15:44:58
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-07-03 15:40:28
 * @Description: 
-->
<template>
    <el-container class="layout">
        <el-header>
            <div class="header-lf mask-image">
                <div class="logo flx-center">
                    <!-- <img class="logo-img" src="@/assets/images/logo_header.png" alt="logo" /> -->
                    <!-- <span class="logo-text">源启基础运行支撑平台</span> -->

                    <span class="logo-txt">后台管理系统</span>
                </div>
            </div>
            <div class="header-ri">
                <ToolBarRight />
            </div>
        </el-header>
        <el-container class="classic-content">
            <el-aside>
                <div class="aside-box" :style="{ width: isCollapse ? '65px' : '210px' }">
                    <el-scrollbar>
                        <el-menu
                            :router="false"
                            :default-active="activeMenu"
                            :collapse="isCollapse"
                            :unique-opened="accordion"
                            :collapse-transition="false"
                        >
                            <SubMenu :menu-list="menuList" />
                        </el-menu>
                    </el-scrollbar>
                    <CollapseIcon id="collapseIcon" />
                </div>
            </el-aside>

            <el-container class="classic-main">
                <Main />
            </el-container>
        </el-container>
    </el-container>
</template>

<script setup lang="ts" name="layout">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/modules/auth'
import { useGlobalStore } from '@/stores/modules/global'
import Main from '@/layouts/components/Main/index.vue'
import SubMenu from '@/layouts/components/Menu/SubMenu.vue'
import CollapseIcon from '@/layouts/components/Header/components/CollapseIcon.vue'
import ToolBarRight from '@/layouts/components/Header/ToolBarRight.vue'

const route = useRoute()
const authStore = useAuthStore()
const globalStore = useGlobalStore()
const accordion = computed(() => globalStore.accordion)
const isCollapse = computed(() => globalStore.isCollapse)
const menuList = computed(() => authStore.showMenuListGet)
const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path) as string)
</script>

<style scoped lang="scss">
.layout {
    min-width: 980px;
}
@import './index.scss';
</style>
