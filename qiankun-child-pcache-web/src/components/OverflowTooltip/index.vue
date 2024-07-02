<!--
 * @Author: yangmiaomiao
 * @Date: 2024-03-22 11:05:56
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-03-25 11:22:21
 * @Description: 
-->
<template>
    <el-tooltip :disabled="disabled" :content="content" :placement="placement" effect="dark" raw-content>
        <div :id="id" class="overflow-tooltip">
            <slot />
        </div>
    </el-tooltip>
</template>

<script setup name="OverflowTooltip">
import { onMounted, ref } from 'vue';
const props = defineProps({
    content: [String, Number, Boolean],
    placement: {
        type: String,
        default: 'top-start',
    },
});

const id = ref(Math.random().toString(36).slice(2)),
    disabled = ref(true),
    title = ref('');

onMounted(() => {
    //获取ID元素
    const el = document.getElementById(id.value);
    // 获取元素的样式（ CSSStyleDeclaration 对象）
    const elComputed = document.defaultView.getComputedStyle(el, '');
    // 获取元素的 padding 值
    const padding =
        parseInt(elComputed.paddingLeft.replace('px', '')) + parseInt(elComputed.paddingRight.replace('px', ''));
    // 创建一个 Range 对象：使用 range 代替 scrollWidth 来判断文本是否溢出，这样做是为了解决潜在的 bug。
    const range = document.createRange();
    // 设置 range 的起点
    range.setStart(el, 0);
    // 设置 range 的终点，因为起终点都在同一个节点上，所以设置终点偏移量以选中节点的内容
    range.setEnd(el, el.childNodes.length);
    // 获取节点的内容的宽度
    const rangeWidth = range.getBoundingClientRect().width;
    //设置el下的第一个子节点溢出隐藏
    if (el.firstElementChild) el.firstElementChild.classList.add('text-ellipsis');

    // 节点的内容真实宽度大于节点宽度时设置disabled为false，启用tooltip
    // 由于element ui 中把 box-sizing 设置为了 border-box，因此真实宽度需要加上padding

    if (rangeWidth + padding > el.offsetWidth || el.scrollWidth > el.offsetWidth) {
        disabled.value = false;
        title.value = props.content;
    }
});
</script>

<style lang="scss" scoped>
.text-ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.overflow-tooltip {
    @extend .text-ellipsis;
    min-width: 50px;
    box-sizing: border-box;
    display: flex;
}
</style>
