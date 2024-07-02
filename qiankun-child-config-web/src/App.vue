<!--
 * @Author: yangmiaomiao
 * @Date: 2024-06-15 16:58:07
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-07-02 11:10:02
 * @Description: 
-->

<template>
    <HelloWorld msg="hello,我是子应用(微应用)" />
</template>
<script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>

<style scoped>
.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
}
.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
