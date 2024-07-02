<!--
 * @Author: yangmiaomiao
 * @Date: 2024-01-25 17:07:26
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-04-26 16:19:58
 * @Description: table
-->
<template>
    <div class="table-box">
        <el-table
            ref="tableRef"
            :data="processTableData"
            :border="border"
            :row-key="rowKey"
            :stripe="stripe"
            @selection-change="selectionChange"
        >
            <!-- table-layout="fixed" -->
            <template v-for="item in tableColumns" :key="item.prop">
                <!-- selection全选  || index 序号 || expand 折叠 || sort排序 || enum 字典值 || tag 标签 || switch 开关 ||  -->
                <el-table-column
                    v-if="item.type && columnTypes.includes(item.type)"
                    v-bind="item"
                    :align="item.align ?? 'center'"
                    :reserve-selection="item.type === 'selection'"
                    :show-overflow-tooltip="item.type !== 'selection' ? item.showOverflowTooltip ?? true : false"
                >
                    <template #default="{ row }">
                        <!-- enum 字典值 -->
                        <template v-if="item.type === 'enum'">
                            {{
                                getNameByCode(item.enum, row[item.prop], item.fieldNames?.value, item.fieldNames?.label)
                            }}
                        </template>
                        <!-- switch -->
                        <template v-if="item.type === 'switch'">
                            <el-switch
                                v-model="row[item.prop]"
                                :loading="
                                    item.switchRow?.row[rowKey] === row[rowKey] && item.switchRow?.prop === item.prop
                                        ? item.switchRow.loading
                                        : false
                                "
                                inline-prompt
                                :active-value="item.switchRow.active ?? true"
                                :inactive-value="item.switchRow.inactive ?? false"
                                :active-icon="Check"
                                :inactive-icon="Close"
                                :before-change="() => item.beforeChange(row)"
                            />
                        </template>
                        <!-- tag 标签 -->
                        <template v-if="item.type === 'tag'">
                            <el-tag :type="getEnumItem(item.enum, row[item.prop], item.fieldNames?.value).tagType">{{
                                getNameByCode(item.enum, row[item.prop], item.fieldNames?.value, item.fieldNames?.label)
                            }}</el-tag>
                        </template>
                        <!-- expand 展开 -->
                        <template v-if="item.type === 'expand'">
                            <component :is="item.render" v-bind="row" v-if="item.render" />
                            <slot v-else :name="item.type" v-bind="row" />
                        </template>
                        <!-- render 自定义内容 -->
                        <template v-if="item.type === 'render'">
                            <component :is="item.render" v-bind="row" v-if="item.render" />
                            <slot v-else :name="item.type" v-bind="row" />
                        </template>
                    </template>
                </el-table-column>

                <!-- other -->
                <!-- <el-table-column
                    v-if="!item.type && item.prop"
                    v-bind="item"
                    :align="item.align ?? 'center'"
                    :show-overflow-tooltip="item.type !== 'selection' ? item.showOverflowTooltip ?? true : false"
                >
                    <template #default="{ row }">{{ row[item.prop] }}</template>
                </el-table-column> -->

                <RenderTableColumn v-if="!item.type && item.prop && item.isShow" :column="item">
                    <template v-for="slot in Object.keys($slots)" #[slot]="scope">
                        <slot :name="slot" v-bind="scope" />
                    </template>
                </RenderTableColumn>
            </template>

            <!-- 操作 -->
            <slot name="operation"></slot>
        </el-table>

        <slot name="pagination">
            <TablePagination
                v-if="isPageable"
                :pageNum="pageable.pageNum"
                :pageSize="pageable.pageSize"
                :total="pageable.total"
                :on-size-change="handleSizeChange"
                :on-current-change="handleCurrentChange"
            />
        </slot>
    </div>
</template>

<script setup lang="ts" name="TableColumns">
import { ref, reactive, computed, watch } from 'vue'
import { ElTable } from 'element-plus'
import { Check, Close } from '@element-plus/icons-vue'
import RenderTableColumn from './components/RenderTableColumn.vue'
import TablePagination from '@/components/TablePagination/index.vue'
import { ColumnProps, TypeProps } from '@/components/TableColumns/interface'
import { getNameByCode, getEnumItem } from '@/utils'
import { useSelection } from '@/hooks/useSelection'

const tableRef = ref<InstanceType<typeof ElTable>>()

export interface ProTableProps {
    columns: ColumnProps[] // 列配置项  ==> 必传
    data?: any[] // 静态 table data 数据，若存在则不会使用 requestApi 返回的 data ==> 非必传
    tableData?: any[] // requestApi 返回的 data ==> 非必传
    requestApi?: (params: any) => Promise<any> // 请求表格数据的 api ==> 非必传
    requestAuto?: boolean // 是否自动执行请求 api ==> 非必传（默认为true）
    requestError?: (params: any) => void // 表格 api 请求错误监听 ==> 非必传
    dataCallback?: (data: any) => any // 返回数据的回调函数，可以对数据进行处理 ==> 非必传
    title?: string // 表格标题 ==> 非必传
    rowKey?: string // 行数据的 Key，用来优化 Table 的渲染，当表格数据多选时，所指定的 id ==> 非必传（默认为 id）
    border?: boolean // 是否带有纵向边框，默认为 false ==> 非必传（默认为 true）
    stripe?: boolean // 是否为斑马纹 table，默认为 false ==> 非必传（默认为 true）
    isPageable?: boolean // 是否显示分页，默认为 true ==> 非必传（默认为 true）
    initParam?: any // 初始化请求参数 ==> 非必传（默认为{}）
    pageable?: any // 分页配置 ==> 非必传（默认为{}）
    handleSizeChange?: (pageSize: number) => void // 每页条数切换回调事件 ==> 非必传
    handleCurrentChange?: (currentPage: number) => void // 页码切换回调事件 ==> 非必传
}

// 接受父组件参数，配置默认值
const props = withDefaults(defineProps<ProTableProps>(), {
    columns: () => [],
    requestAuto: true,
    initParam: {},
    rowKey: 'id',
    border: true,
    stripe: false,
    isPageable: true,
})

// 接收 columns 并设置为响应式
// 过滤在table中展示的内容
// let tableColumns = reactive<ColumnProps[]>(
let tableColumns = reactive<any[]>(
    props.columns.map((col) => ({ ...col, isShow: col.isShow ?? true })).filter((v) => v.isShow),
)

watch(
    () => props.columns,
    (val) => {
        if (val) {
            tableColumns = val.map((col) => ({ ...col, isShow: col.isShow ?? true })).filter((v) => v.isShow)
        }
    },
)

// // 处理表格数据
const processTableData = computed(() => {
    if (!props.data) return props.tableData
    if (!props.isPageable) return props.data
    return props.data.slice(
        (props.pageable.value.pageNum - 1) * props.pageable.value.pageSize,
        props.pageable.value.pageSize * props.pageable.value.pageNum,
    )
})
// 表格多选 Hooks
const { selectionChange, selectedList, selectedListIds, isSelected } = useSelection(props.rowKey)

// column 列类型
const columnTypes: TypeProps[] = ['selection', 'index', 'expand', 'switch', 'enum', 'tag', 'render']

// 清空选中数据列表
const clearSelection = () => tableRef.value!.clearSelection()

//清空筛选中的数据列表
const clearFilter = () => {
    tableRef.value!.clearFilter()
}

// 清空排序的数据列表
const clearSort = () => {
    tableRef.value!.clearSort()
}
// 暴露给父组件的参数和方法 (外部需要什么，都可以从这里暴露出去)
defineExpose({
    element: tableRef,
    clearSelection,
    clearFilter,
    clearSort,
    isSelected,
    selectedList,
    selectedListIds,
})
</script>
