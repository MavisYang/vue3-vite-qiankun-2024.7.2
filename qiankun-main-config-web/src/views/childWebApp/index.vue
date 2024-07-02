<!--
 * @Author: yangmiaomiao
 * @Date: 2024-06-27 15:59:00
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-07-02 15:18:34
 * @Description: 
-->
<template>
    <div id="child-web"></div>
</template>

<script setup name="childWebApp">
import { onMounted } from 'vue'
import { start } from 'qiankun'
onMounted(() => {
    if (!window.qiankunStarted) {
        window.qiankunStarted = true
        start({
            prefetch: true, // 是否开启预加载
            sandbox: {
                experimentalStyleIsolation: true, // 实验性的样式隔离
            },
        })
    }
})
</script>

<style lang="scss" scoped></style>
