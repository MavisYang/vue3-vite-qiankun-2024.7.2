<!--
 * @Author: yangmiaomiao
 * @Date: 2024-01-16 10:27:52
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-03-29 11:39:21
 * @Description: 
-->
<template>
    <div class="formContainer">
        <el-form class="searchContainer" :model="searchData" label-width="100px">
            <template v-for="(item, index) in searchFormList" :key="item.prop">
                <el-form-item v-if="item.searchType == 'input' && flodShow(index)" :label="item.label">
                    <el-input v-model="searchData[item.prop]" placeholder="请输入" clearable />
                </el-form-item>

                <el-form-item v-if="item.searchType === 'select' && flodShow(index)" :label="item.label">
                    <el-select v-model="searchData[item.prop]" placeholder="请选择" clearable>
                        <el-option v-if="item.all" label="全部" value="" />
                        <el-option
                            v-for="stems in item.enum"
                            :key="stems[selectValue]"
                            :label="stems[selectLabel]"
                            :value="stems[selectValue]"
                        />
                    </el-select>
                </el-form-item>

                <el-form-item v-if="item.searchType == 'number' && flodShow(index)" :label="item.label">
                    <el-input v-model:number="searchData[item.prop]" placeholder="请输入" clearable />
                </el-form-item>

                <template v-if="item.searchType == 'custom-select' && flodShow(index)">
                    <StepSecond :formData="searchData" :initFled="{}" :handleSelect="onChange" :required="false" />
                </template>
            </template>

            <div v-if="searchFormList.length <= showLength" class="el-form-item el-form-btn">
                <el-button @click="onReset" style="width: 86px; margin-left: 16px">重置</el-button>
                <el-button type="primary" style="width: 86px" @click="onSearch">查询</el-button>
            </div>
        </el-form>

        <div v-if="searchFormList.length > showLength" class="el-form-search-box">
            <el-button
                class="el-form-search-arraw"
                link
                type="primary"
                @click="foldFilterConditions = !foldFilterConditions"
            >
                <template #default>
                    <template v-if="!foldFilterConditions">
                        展开条件({{ searchFormList.length - showLength || 0 }})<el-icon class="el-icon--right"
                            ><ArrowDown
                        /></el-icon>
                    </template>
                    <template v-else>
                        收起条件<el-icon class="el-icon--right"><ArrowUp /></el-icon>
                    </template>
                </template>
            </el-button>
            <div class="el-form-search-btn">
                <el-button @click="onReset" style="width: 86px; margin-left: 16px">重置</el-button>
                <el-button type="primary" style="width: 86px" @click="onSearch">查询</el-button>
            </div>
        </div>
    </div>
</template>

<script setup name="SelectForm">
import { ref, watch } from 'vue'
import StepSecond from '@/views/interfaceRegister/addModules/StepSecond.vue'
const props = defineProps({
    searchFormList: {
        type: Array,
        default: () => [],
    },
    searchData: {
        type: Object,
        default: () => ({}),
    },
    selectLabel: {
        type: String,
        default: 'dataValue',
    },
    selectValue: {
        type: String,
        default: 'dataCode',
    },
    onReset: {
        type: Function,
        default: () => {},
    },
    onSearch: {
        type: Function,
        default: () => {},
    },
    onChange: {
        type: Function,
        default: () => {},
    },
    showLength: {
        type: Number,
        default: 6,
    },
})
const foldFilterConditions = ref(false)

const flodShow = (index) => {
    const value = index < props.showLength ? true : foldFilterConditions.value
    return value
}
</script>

<style scoped lang="scss">
.formContainer {
    padding-bottom: 32px;
    border-bottom: 4px solid transparent;

    .el-form {
        display: flex;
        flex-wrap: wrap;
    }

    .el-form-item {
        flex: none;
        width: 33.3%;

        &.el-form-btn:nth-child(2),
        &.el-form-btn:nth-child(3),
        &.el-form-btn:nth-child(5),
        &.el-form-btn:nth-child(6) {
            flex: auto;
            justify-content: end;
        }
        &.el-form-btn:nth-child(4),
        &.el-form-btn:nth-child(7) {
            margin: 18px auto 0;
            width: auto;
        }
    }

    .el-form-search-box {
        display: flex;
        align-items: center;
        margin-top: 18px;
        margin-left: 16px;

        .el-form-search-arraw {
            width: 100px;
        }

        .el-form-search-btn {
            margin: 0 auto;
            width: auto;
        }
    }
}

/*input 添加 clearable属性 聚焦时宽度会变化*/
:deep(.el-input__wrapper) {
    position: relative;
    .el-input__inner {
        padding-right: 18px;
    }
    .el-input__suffix {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
    }
}
</style>
