<!--
 * @Author: yangmiaomiao
 * @Date: 2024-01-06 10:00:16
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-05-24 09:29:58
 * @Description: 头部展开收起查询
-->
<template>
    <div v-if="columns.length" :class="['table-search mb-10', classType]">
        <el-form ref="formRef" :model="searchParam">
            <Grid ref="gridRef" :collapsed="collapsed" :gap="[20, 0]" :cols="searchCol">
                <GridItem
                    v-for="(item, index) in searchColumns"
                    :key="item.prop"
                    v-bind="getResponsive(item)"
                    :index="index"
                >
                    <el-form-item>
                        <template #label>
                            <el-space :size="4">
                                <span :style="`width:${labelWidth}`">{{ `${item.search?.label ?? item.label}` }}</span>
                                <el-tooltip
                                    v-if="item.search?.tooltip"
                                    effect="dark"
                                    :content="item.search?.tooltip"
                                    placement="top"
                                >
                                    <i :class="'iconfont icon-yiwen'"></i>
                                </el-tooltip>
                            </el-space>
                            <!-- <span>：</span> -->
                        </template>
                        <SearchFormItem :column="item" :search-param="searchParam" />
                    </el-form-item>
                </GridItem>
                <GridItem suffix>
                    <div class="operation">
                        <el-button @click="reset"> 重置 </el-button>
                        <el-button type="primary" @click="search"> 查询 </el-button>
                        <el-button
                            v-if="showCollapse"
                            type="primary"
                            link
                            class="search-isOpen"
                            @click="collapsed = !collapsed"
                        >
                            {{ collapsed ? '展开' : '收起' }}
                            <el-icon class="el-icon--right">
                                <component :is="collapsed ? ArrowDown : ArrowUp"></component>
                            </el-icon>
                        </el-button>
                    </div>
                </GridItem>
            </Grid>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { ref, unref, computed, reactive, provide } from 'vue'
import { BreakPoint } from '@/components/Grid/interface'
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import SearchFormItem from './components/SearchFormItem.vue'
import Grid from '../Grid/index.vue'
import GridItem from '../Grid/components/GridItem.vue'
import { ColumnProps } from '@/components/TableColumns/interface'
import { handleProp } from '@/utils'

interface Props {
    columns?: ColumnProps[] // 搜索配置列
    searchParam?: { [key: string]: any } //搜索参数
    searchCol?: number | Record<BreakPoint, number> // 表格搜索项 每列占比配置 ==> 非必传 { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }
    search: (params: any) => void // 搜索方法
    reset: (params: any) => void // 重置方法
    labelWidth?: string //label宽度
    classType?: 'default' | 'card' | 'border' // 搜索框类型
}
const props = withDefaults(defineProps<Props>(), {
    columns: () => [],
    searchParam: () => ({}),
    searchCol: () => ({ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }),
    labelWidth: 'auto',
    classType: 'card',
})

// 获取响应式设置
const getResponsive = (item: any) => {
    return {
        span: item.search?.span,
        offset: item.search?.offset ?? 0,
        xs: item.search?.xs,
        sm: item.search?.sm,
        md: item.search?.md,
        lg: item.search?.lg,
        xl: item.search?.xl,
    }
}

// 是否默认折叠搜索项
const collapsed = ref(true)

// 获取响应式断点
const gridRef = ref()
const breakPoint = computed<BreakPoint>(() => gridRef.value?.breakPoint)
// 判断是否显示 展开/合并 按钮
const showCollapse = computed(() => {
    let show = false
    props.columns
        .filter((v) => v.search)
        .reduce((prev, current) => {
            prev +=
                (current.search![breakPoint.value]?.span ?? current.search?.span ?? 1) +
                (current.search![breakPoint.value]?.offset ?? current.search?.offset ?? 0)
            if (typeof props.searchCol !== 'number') {
                if (prev >= props.searchCol[breakPoint.value]) show = true
                if (breakPoint.value === 'xs' && prev === props.searchCol[breakPoint.value]) show = false
            } else {
                if (prev >= props.searchCol) show = true
            }
            return prev
        }, 0)
    return show
})
// 定义 enumMap 存储 enum 值（避免异步请求无法格式化单元格内容 || 无法填充搜索下拉选择）
const enumMap = ref(new Map<string, { [key: string]: any }[]>())
const setEnumMap = async ({ prop, enum: enumValue }: ColumnProps) => {
    if (!enumValue) return

    // 如果当前 enumMap 存在相同的值 return
    if (enumMap.value.has(prop!) && (typeof enumValue === 'function' || enumMap.value.get(prop!) === enumValue)) return

    // 当前 enum 为静态数据，则直接存储到 enumMap
    if (typeof enumValue !== 'function') return enumMap.value.set(prop!, unref(enumValue!))

    // 为了防止接口执行慢，而存储慢，导致重复请求，所以预先存储为[]，接口返回后再二次存储
    enumMap.value.set(prop!, [])

    // 当前 enum 为后台数据需要请求数据，则调用该请求接口，并存储到 enumMap
    const { data } = await enumValue()
    enumMap.value.set(prop!, data)
}

// 注入 enumMap
provide('enumMap', enumMap)

// 接收 columns 并设置为响应式
const tableColumns = reactive<ColumnProps[]>(props.columns)

// 扁平化 columns
const flatColumns = computed(() => flatColumnsFunc(tableColumns))

// 扁平化 columns 的方法
const flatColumnsFunc = (columns: ColumnProps[], flatArr: ColumnProps[] = []) => {
    columns.forEach(async (col) => {
        if (col._children?.length) flatArr.push(...flatColumnsFunc(col._children))
        flatArr.push(col)

        // column 添加默认 isShow && isFilterEnum 属性值
        col.isShow = col.isShow ?? true //是否显示在表格当中
        col.isFilterEnum = col.isFilterEnum ?? true
        col.isSearch = col.isSearch ?? false //是否作为搜索项

        // 设置 enumMap
        await setEnumMap(col)
    })
    return flatArr.filter((item) => !item._children?.length)
}

// 过滤需要搜索的配置项 && 排序
const searchColumns = computed(() => {
    return flatColumns.value
        ?.filter((item) => item.search?.el || item.search?.render)
        .sort((a, b) => a.search!.order! - b.search!.order!)
})

// 设置 搜索表单默认排序 && 搜索表单项的默认值
searchColumns.value?.forEach((column, index) => {
    column.search!.order = column.search?.order ?? index + 2
    const key = column.search?.key ?? handleProp(column.prop!)
    const defaultValue = column.search?.defaultValue
    if (defaultValue !== undefined && defaultValue !== null) {
        props.searchParam[key] = defaultValue
    }
})
</script>

<style scoped lang="scss">
.operation {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 18px;
}
</style>
