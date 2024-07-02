<!--
 * @Author: yangmiaomiao 
 * @Date: 2024-06-15 14:32:16
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-06-27 10:29:35
 * @FilePath: /qiankun-main-config-web/src/sidebar/components/SidebarMenu.vue
 * @Description: 
-->
<template>
    <el-menu :default-active="$route.name" :collapse="collapse" :collapse-transition="false">
        <router-link class="el-menu-item" v-for="item in router" :key="item.name" :to="item.path">
            <el-menu-item :index="item.name">
                <i :class="item.icon"></i>
                <span slot="title">{{ item.title }}</span>
            </el-menu-item>
        </router-link>
    </el-menu>
</template>

<script>
export default {
    name: 'SidebarMenu',
    props: {
        collapse: {
            type: Boolean,
            required: true,
        },
    },

    computed: {
        router() {
            return this.$router.options.routes.filter((item) => !item.hidden)
        },
    },
}
</script>

<style lang="scss" scoped>
.ep-menu {
    height: 100%;
    .ep-menu-item {
        text-align: left;
        span {
            margin-left: 10px;
        }
    }
    .ep-menu-item.is-active {
        background-color: #e7f0fe;
    }
}
</style>
