<!--
 * @Author: yangmiaomiao
 * @Date: 2024-06-15 14:51:12
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-07-03 10:13:18
 * @FilePath: /qiankun-main-config-web/src/views/Home.vue
-->
<template>
    <div class="home-view">
        <div class="home-header">
            <div class="home-header-title">{{ title }}</div>
            <div class="home-header-nav">
                <div class="home-header-nav-item" v-for="item in microApp" :key="item.path" @click="toPath(item.path)">
                    <span>{{ item.name }}</span>
                    <span>{{ item.subTitle }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const title = ref('新一代分布式核心系统')
const microApp = computed(() => router.options.routes.filter((v) => v.path != '/' && !v.hidden))

const toPath = (path) => {
    console.log(path, 'path')
    router.push(path)
}
</script>

<style lang="scss" scoped>
.home-view {
    width: 100vw;
    height: 100vh;
}
.home-header-title {
    font-size: 24px;
    font-weight: 600;
    color: #333333;
    line-height: 33px;
    padding: 32px;
}
.home-header-nav {
    padding: 32px;
    display: flex;
    flex-wrap: wrap;
    &-item {
        border: 1px solid #e6e6e6;
        border-radius: 4px;
        margin-right: 16px;
        margin-bottom: 16px;
        cursor: pointer;
        text-align: center;
        width: 25%;
        height: 100px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        span {
            display: block;
            &:first-child {
                font-size: 14px;
                font-weight: 400;
                color: #333333;
                line-height: 20px;
                margin-bottom: 4px;
            }
            &:last-child {
                font-size: 12px;
                font-weight: 400;
                color: #999999;
                line-height: 17px;
            }
        }
    }
}
</style>
