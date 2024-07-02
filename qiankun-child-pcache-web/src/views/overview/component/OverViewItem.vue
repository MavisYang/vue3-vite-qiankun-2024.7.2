<!--
 * @Author: yangmiaomiao
 * @Date: 2024-07-01 10:40:52
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-07-01 11:20:39
 * @Description: 
-->
<template>
    <el-card class="overViewItem">
        <template #header>
            <div class="card-header">
                <div class="title">{{ card.title }}</div>
                <div class="icon">
                    <span class="btnText">{{ card.btnText }}</span>
                    <el-icon class="edit" :size="16" @click="btnClick">
                        <Edit />
                    </el-icon>
                </div>
            </div>
        </template>
        <div class="desc">{{ card.desc }}</div>
    </el-card>
</template>

<script setup lang="ts">
import { Edit } from '@element-plus/icons-vue'
// type Item = {
//     title: string
//     desc: string
//     btnText: string
// }
interface Props {
    card: {
        title: string
        desc: string
        btnText: string
    }
    btnClick: () => void
}

const props = withDefaults(defineProps<Props>(), {})
</script>

<style scoped lang="scss">
.overViewItem {
    max-width: 260px;
    min-height: 280px;
    text-align: left;
    font-size: 14px;
    display: inline-block;
    margin-right: 20px;

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .icon {
        display: flex;
        align-items: center;
        font-size: 12px;
        cursor: pointer;
        &:hover {
            text-decoration: underline;
        }
        .btnText {
            color: $primaryColor;
        }
        .edit {
            color: $primaryColor;
        }
    }
    .title {
        font-size: 16px;
        color: #333;
    }
    .desc {
        color: #666;
        margin-top: 10px;
    }
}
</style>
