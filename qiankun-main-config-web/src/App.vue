<!--
 * @Author: yangmiaomiao 
 * @Date: 2024-06-15 14:23:52
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-06-27 14:23:19
 * @FilePath: /qiankun-main-config-web/src/App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <el-config-provider namespace="ep">
        <el-container class="qiankun-container">
            <Sidebar v-show="route.path !== '/'" />
            <el-main>
                <router-view />
            </el-main>
        </el-container>
    </el-config-provider>
</template>

<script setup>
import Sidebar from '@/sidebar'
import { useRoute } from 'vue-router'
const route = useRoute()
</script>
