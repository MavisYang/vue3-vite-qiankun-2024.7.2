<!--
 * @Author: yangmiaomiao
 * @Date: 2024-06-15 15:00:58
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-07-02 10:48:42
 * @Description: 
-->
<template>
    <div id="file-web"></div>
</template>

<script setup name="fileWeb">
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
