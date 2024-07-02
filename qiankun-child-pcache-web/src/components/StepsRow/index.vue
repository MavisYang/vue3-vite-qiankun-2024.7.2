<!--
 * @Author: yangmiaomiao
 * @Date: 2024-01-20 18:00:48
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-07-01 13:36:38
 * @Description: 
-->
<template>
    <div class="steps-row-box">
        <div class="step-item" v-for="(item, index) in stepList" :key="index">
            <el-icon v-if="status === 'icon' && item.success" class="success-icon-num"><CircleCheck /></el-icon>
            <span v-else :class="['num', index + 1 === activeValue && 'active-num', item.success && 'success-num']">
                {{ index + 1 }}
            </span>
            <span :class="['text', index + 1 <= activeValue ? 'active-text' : '']">{{ item.title }}</span>
            <span
                v-if="index + 1 !== stepList.length"
                :class="['line', index + 1 < activeValue && 'active-line']"
            ></span>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { CircleCheck } from '@element-plus/icons-vue'
const props = defineProps({
    // 步骤条数据
    list: {
        type: Array,
        default: () => [
            // { step: 1, text: '接口基本设置', success: false }
        ],
    },
    active: {
        type: Number,
        default: 1,
    },
    status: {
        type: String,
        default: 'icon', //icon对勾 text数字
    },
})

const activeValue = ref(props.active),
    stepList = ref(props.list)
watch(
    () => props.active,
    () => {
        activeValue.value = props.active
        //修改step
        stepList.value = stepList.value.map((v) => ({ ...v, success: v.step < activeValue.value }))
    },
)
</script>

<style lang="scss" scoped>
.steps-row-box {
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;

    .step-item {
        display: inline-flex;
        align-items: center;
        flex-direction: row;
    }

    .num {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 10px;
        font-family: PingFang SC, PingFang SC;
        font-size: 14px;

        color: #999999;
        background-color: #fff;
        border: 2px solid #999999;
        font-weight: 600;
    }
    .active-num {
        color: #fff;
        background-color: #1d70f5;
        border: 2px solid #1d70f5;
    }
    .success-num {
        color: #fff;
        background-color: #00b42a;
        border: 2px solid #00b42a;
    }

    .success-icon-num {
        color: #00b42a;
        font-size: 24px;
        margin: 0 10px;
    }
    .text {
        font-family: PingFang SC, PingFang SC;
        font-size: 14px;
        font-weight: 500;
        color: #999999;
    }

    .active-text {
        font-weight: 600;
        color: #222222;
    }

    .success-text {
        font-weight: 600;

        color: #00b42a;
    }

    .line {
        width: 108px;
        height: 1px;
        background-color: #cccccc;
        margin-left: 10px;
    }

    .active-line {
        background-color: #00b42a;
    }
}
</style>
