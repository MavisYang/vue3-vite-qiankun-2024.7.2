<!--
 * @Author: yangmiaomiao 
 * @Date: 2024-06-15 14:32:16
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-07-03 14:48:21
 * @FilePath: /qiankun-main-config-web/src/sidebar/components/SidebarMenu.vue
 * @Description: 
-->
<template>
    <el-menu
        :router="false"
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="false"
        :collapse-transition="false"
    >
        <el-menu-item v-for="item in menuList" :key="item.path" :index="item.name" @click="handleClickMenu(item)">
            <el-icon class="collapse-icon">
                <component :is="item.icon"></component>
            </el-icon>
            <template #title>
                <span slot="title">{{ item.title }}</span>
            </template>
        </el-menu-item>
    </el-menu>
</template>

<script setup name="SidebarMenu">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

defineProps(['isCollapse'])
const route = useRoute()
const router = useRouter()
const activeMenu = computed(() => {
    const { name, path } = route
    return name
})
const menuList = computed(() => router.options.routes.filter((item) => !item.hidden))
const handleClickMenu = (item) => {
    router.push(item.path)
}
</script>
<style lang="scss" scoped>
.ep-sub-menu .ep-sub-menu__title:hover {
    color: var(--ep-menu-hover-text-color) !important;
    background-color: transparent !important;
}
.ep-menu--collapse {
    .is-active {
        .ep-sub-menu__title {
            color: #ffffff !important;
            background-color: var(--ep-color-primary) !important;
        }
    }
}
.ep-menu-item {
    font-size: 15px;
    &:hover {
        color: var(--ep-menu-hover-text-color);
    }
    &.is-active {
        color: var(--ep-menu-active-color) !important;
        background-color: var(--ep-menu-hover-bg-color) !important;
        &::before {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            width: 4px;
            content: '';
            background-color: var(--ep-color-primary);
        }
    }
}
</style>
