<!--
 * @Author: yangmiaomiao
 * @Date: 2024-02-04 15:44:58
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-07-02 16:35:54
 * @Description: 
-->
<template>
    <el-dropdown trigger="click">
        <div class="avatar-box">
            <span class="avatar" v-if="avator">{{ avator }}</span>
            {{ userStore.userInfo.userName }}
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
        </div>
        <template #dropdown>
            <el-dropdown-menu>
                <!-- <el-dropdown-item @click="openDialog('infoRef')">
                    <el-icon><User /></el-icon>{{ $t('header.personalData') }}
                </el-dropdown-item>
                <el-dropdown-item @click="openDialog('passwordRef')">
                    <el-icon><Edit /></el-icon>{{ $t('header.changePassword') }}
                </el-dropdown-item> 
                <el-dropdown-item divided @click="logout">
                    <el-icon><SwitchButton /></el-icon>{{ $t('header.logout') }}
                </el-dropdown-item>
                -->
                <el-dropdown-item @click="logout">
                    <el-icon><SwitchButton /></el-icon>{{ $t('header.logout') }}
                </el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
    <!-- infoDialog -->
    <InfoDialog ref="infoRef"></InfoDialog>
    <!-- passwordDialog -->
    <!-- <PasswordDialog ref="passwordRef"></PasswordDialog> -->
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { logoutApi } from '@/api/service/login'
import { useUserStore } from '@/stores/modules/user'
import { useAuthStore } from '@/stores/modules/auth'
import { ElMessageBox, ElMessage } from 'element-plus'
import InfoDialog from './InfoDialog.vue'
// import PasswordDialog from "./PasswordDialog.vue";
import { LOGIN_URL } from '@/routers/helper'

const userStore = useUserStore()
const authStore = useAuthStore()
const router = useRouter()

// 打开修改密码和个人信息弹窗
// const infoRef = ref<InstanceType<typeof InfoDialog> | null>(null)
// const passwordRef = ref<InstanceType<typeof PasswordDialog> | null>(null);
// const openDialog = (ref: string) => {
//     if (ref == 'infoRef') infoRef.value?.openDialog()
//     if (ref == "passwordRef") passwordRef.value?.openDialog();
// }

// 获取用户名的第一个字符
const avator = computed(getAvator)

function getAvator() {
    const { userName, nickname } = userStore.userInfo

    if (userName) {
        let obj = userName.slice(0, 1)
        let reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
        let avator
        if (reg.test(obj)) {
            // 如果是中文的话取第一个字
            avator = userName.slice(0, 1)
        } else {
            avator = userName.slice(0, 1).toUpperCase()
        }
        return avator
    }
}

// 退出登录
const logout = () => {
    ElMessageBox.confirm('您是否确认退出登录?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        // 1.执行退出登录接口
        await logoutApi()

        // 2.清除 Token
        userStore.setToken('')
        userStore.setUserInfo({})
        //清除sessionStorage和localStorage
        sessionStorage.clear()
        localStorage.clear()

        // 3.重定向到登陆页
        router.replace(LOGIN_URL)
        ElMessage.success('已退出登录')
    })
}
</script>

<style scoped lang="scss">
.avatar-box {
    display: flex;
    align-items: center;
    color: $color-white;
    margin-left: 26px;
    cursor: pointer;
}
.avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    overflow: hidden;

    border-radius: 50%;
    font-weight: 700;
    color: #1d70f5;
    background-color: $color-white;
    margin-right: 10px;

    .username {
        font-size: 15px;
    }
}
</style>
