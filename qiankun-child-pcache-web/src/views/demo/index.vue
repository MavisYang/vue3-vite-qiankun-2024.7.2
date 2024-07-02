<!--
 * @Author: yangmiaomiao
 * @Date: 2024-05-29 09:33:48
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-06-20 15:48:01
 * @Description: 
-->
<template>
    <div class="card bg-card">
        <template v-for="item in IconSvgs.glyphs" :key="item.name">
            <SvgIcon :name="`#${item.font_class}`" size="40px" className="svgIcon" />
        </template>

        <br />
        <i :class="'iconfont icon-yiwen'"></i>
        <i :class="'iconfont icon-xiala'"></i>
        <i :class="'iconfont icon-tuichu'"></i>
        <i :class="'iconfont icon-xiaoxi'"></i>
        <i :class="'iconfont icon-zhuti'"></i>
        <i :class="'iconfont icon-sousuo'"></i>
        <i :class="'iconfont icon-contentright'"></i>
        <i :class="'iconfont icon-contentleft'"></i>
        <i :class="'iconfont icon-fangda'"></i>
        <i :class="'iconfont icon-suoxiao'"></i>
        <i :class="'iconfont icon-zhongyingwen'"></i>
    </div>
</template>

<script lang="ts" setup>
import IconSvgs from '@/assets/icons/iconfont.json'

import SvgIcon from '@/components/SvgIcon/index.vue'
</script>

<style scoped lang="scss">
.svgIcon {
    cursor: pointer;
    fill: #303133;
    color: #303133;
    :hover,
    :active {
        fill: #1d70f5;
        color: #1d70f5;
    }
}
</style>
