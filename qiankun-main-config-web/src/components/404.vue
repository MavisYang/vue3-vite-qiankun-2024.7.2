<!--
 * @Author: yangmiaomiao
 * @Date: 2024-06-27 10:27:44
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-06-27 10:30:08
 * @Description: 
-->
<template>
    <div class="not-container">
        <div class="not-detail">
            <h2>404</h2>
            <h4>抱歉，您访问的页面不存在~🤷‍♂️🤷‍♀️</h4>
            <el-button type="primary" @click="router.back"> 返回上一页 </el-button>
        </div>
    </div>
</template>

<script setup lang="ts" name="404">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style scoped lang="scss">
.not-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    // .not-img {
    //     margin-right: 120px;
    // }
    .not-detail {
        display: flex;
        flex-direction: column;
        h2,
        h4 {
            padding: 0;
            margin: 0;
        }
        h2 {
            font-size: 60px;
            color: var(--ep-text-color-primary);
        }
        h4 {
            margin: 30px 0 20px;
            font-size: 19px;
            font-weight: normal;
            color: var(--ep-text-color-regular);
        }
        .ep-button {
            width: 100px;
        }
    }
}
</style>
