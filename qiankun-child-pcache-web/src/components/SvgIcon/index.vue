<!--
 * @Author: yangmiaomiao
 * @Date: 2024-02-06 09:55:31
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-06-20 15:48:24
 * @Description: 
-->
<template>
    <svg aria-hidden="true" class="svg-icon" :class="svgClass" :width="size" :height="size" :style="svgStyle">
        <use :class="iconName" :xlink:href="symbolId" />
        <!-- :fill="color" -->
    </svg>
</template>

<script setup lang="ts" name="SvgIcon">
import { computed, CSSProperties } from 'vue'

interface SvgProps {
    name: string // 图标的名称 ==> 必传
    prefix?: string // 图标的前缀 ==> 非必传（默认为"icon"）
    iconStyle?: CSSProperties // 图标的样式 ==> 非必传
    className?: string // svg的class ==> 非必传
    iconClass?: string // icon的class ==> 非必传
    size?: string // icon的大小 ==> 非必传
    color?: string // icon的颜色 ==> 非必传
}

const props = withDefaults(defineProps<SvgProps>(), {
    iconStyle: () => ({}),
    prefix: '',
    iconClass: '',
    size: '100px',
    color: '#606266',
})

const symbolId = computed(() => (props.prefix ? `${props.prefix}-${props.name}` : `${props.name}`))

const iconName = computed(() => (props.iconClass ? `icon-${props.iconClass}` : `icon-${props.name.slice(1)}`))
const svgClass = computed(() =>
    props.className ? `${props.className} icon-${props.name.slice(1)}` : `icon-${props.name.slice(1)}`,
)

const svgStyle = computed(() => {
    return {
        ...props.iconStyle,
        fill: props.color,
        color: props.color,
    }
})
</script>

<!-- 
demo:
 <SvgIcon name="#smile"  className='svgIcon' size="50px"/>

 //hover
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
-->
