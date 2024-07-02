<!--
 * @Author: yangmiaomiao
 * @Date: 2024-01-09 19:39:19
 * @LastEditors: yangmiaomiao
 * @LastEditTime: 2024-03-12 16:12:18
 * @Description: 
-->
<template>
    <el-dialog
        :model-value="visible"
        :title="title"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :destroy-on-close="true"
        @close="handleCancel(ruleFormRef)"
        :width="width"
    >
        <el-form
            class="demo-dialog-form"
            ref="ruleFormRef"
            :model="formData"
            :validate-on-rule-change="false"
            :label-width="labelWidth"
        >
            <template v-for="item in columns" :key="item.prop">
                <el-form-item
                    v-if="item.type === 'input'"
                    :required="item.required"
                    :label="item.label"
                    :prop="item.prop"
                    :rules="item.rules"
                >
                    <el-input
                        v-model="formData[item.prop]"
                        :disabled="item.disabled"
                        :placeholder="`请输入${item.label}`"
                        clearable
                    />
                </el-form-item>

                <el-form-item
                    v-else-if="item.type === 'select'"
                    :required="item.required"
                    :label="item.label"
                    :prop="item.prop"
                    :rules="item.rules"
                >
                    <el-select
                        v-model="formData[item.prop]"
                        :placeholder="`请选择${item.label}`"
                        :disabled="item.disabled"
                        clearable
                    >
                        <el-option
                            v-for="items in item.enum"
                            :key="items[selectLabel]"
                            :label="items[selectValue]"
                            :value="items[selectLabel]"
                            :disabled="items.disabled"
                        />
                    </el-select>
                </el-form-item>
            </template>

            <slot></slot>
        </el-form>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleCancel(ruleFormRef)">取消</el-button>
                <el-button type="primary" @click="handleConfirm(ruleFormRef)"> 确定 </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { FormInstance } from 'element-plus';

interface Props {
    editData: any;
    columns: any;
    labelWidth?: string;
    selectLabel?: string;
    selectValue?: string;
    title?: string;
    onCancel: () => void;
    onConfirm: (data: any) => void;
    visible: boolean;
    width?: number | string;
}

const props = withDefaults(defineProps<Props>(), {
    labelWidth: '120px',
    selectLabel: 'dictCode',
    selectValue: 'dictName',
    columns: [],
    editData: () => {},
    onCancel: () => {},
    onConfirm: () => {},
    visible: false,
    width: 620,
});

//重新定义数据是为了编辑时列表页面数据不修改，解决双向绑定问题
const formData = ref(Object.assign({}, props.editData));

// 新增编辑时的表单校验
const ruleFormRef = ref<FormInstance>();

const handleConfirm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
        if (valid) {
            // console.log("submit!", fields);
            props.onConfirm(formData.value);
        } else {
            console.log('error submit!', fields);
        }
    });
};
const handleCancel = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields(); //重置校验
    formEl.clearValidate(); // 清除校验
    props.onCancel();
};
</script>

<style scoped lang="scss">
.demo-dialog-form {
    .el-select {
        width: 420px;
    }

    .el-input {
        width: 420px;
    }
}
</style>
