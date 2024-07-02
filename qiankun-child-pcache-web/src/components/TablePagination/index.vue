<!--
 * @Author: yangmiaomiao
 * @Date: 2024-01-04 16:21:08
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-03-27 11:43:51
 * @Description: 
-->
<template>
    <el-pagination
        class="pagination"
        v-model:current-page="currentPageV"
        v-model:page-size="pageSizeV"
        :page-sizes="pageSizes"
        :total="total"
        :small="small"
        :disabled="disabled"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="onCurrentChange"
        @size-change="onSizeChange"
    />
</template>

<script setup lang="ts">
import { computed } from 'vue'
interface Props {
    pageNum?: number //pageNum当前页面
    pageSize?: number //每页显示条数
    total?: number
    pageSizes?: number[]
    small?: boolean
    disabled?: boolean
    background?: boolean
    onSizeChange?: (pageSize: number) => void
    onCurrentChange?: (currentPage: number) => void
    onPrevClick?: (currentPage: number) => void
    onNextClick?: (currentPage: number) => void
}

const props = withDefaults(defineProps<Props>(), {
    pageNum: 1,
    pageSize: 10,
    total: 0,
    pageSizes: () => [10, 20, 30, 50],
    small: false,
    disabled: false,
    background: true,
    onSizeChange: () => {},
    onCurrentChange: () => {},
    onPrevClick: () => {},
    onNextClick: () => {},
})
const emit = defineEmits([
    'update:page',
    'update:size',
    'onCurrentChange',
    'onSizeChange',
    'onPrevClick',
    'onNextClick',
])

const currentPageV = computed({
    get: () => {
        return props.pageNum
    },
    set: (val: number) => {
        console.log(val, 'val===111--currentPage')
        emit('update:page', val)
        emit('onCurrentChange', val)
        emit('onPrevClick', val)
        emit('onNextClick', val)
    },
})

const pageSizeV = computed({
    get: () => {
        return props.pageSize
    },
    set: (val: number) => {
        console.log(val, 'val===2222---pageSize')
        emit('update:page', val)
        emit('update:size', val)
        emit('onSizeChange', val)
    },
})
</script>
