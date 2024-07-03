<template>
    <div class="zdjx-login">
        <div class="content">
            <div class="loginLeft"></div>
            <div class="loginRight">
                <div class="loginRight-logo"></div>
                <div class="loginRight-title">后台管理系统</div>

                <el-form
                    :model="loginForm"
                    status-icon
                    :rules="loginRules"
                    ref="loginFormRef"
                    label-position="top"
                    label-width="80px"
                    class="loginForm"
                >
                    <el-form-item prop="username" label="用户名">
                        <el-input
                            v-model="loginForm.username"
                            autocomplete="off"
                            clearable
                            type="text"
                            placeholder="请输入用户名"
                        />
                        <span class="symbol">
                            <el-icon class="el-input__icon">
                                <user />
                            </el-icon>
                        </span>
                    </el-form-item>
                    <el-form-item prop="password" label="密码">
                        <el-input
                            v-model="loginForm.password"
                            autocomplete="off"
                            clearable
                            show-password
                            type="password"
                            placeholder="请输入密码"
                        ></el-input>
                        <span class="symbol">
                            <el-icon class="el-input__icon">
                                <lock />
                            </el-icon>
                        </span>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" id="submit" @click="login(loginFormRef)" :loading="loading"
                            >登录</el-button
                        >
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'
import { useTabsStore } from '@/stores/modules/tabs'
import { useAuthStore } from '@/stores/modules/auth'
import { useKeepAliveStore } from '@/stores/modules/keepAlive'
import { Login } from '@/api/interface'
import { loginApi, getEncrypt, getUserInfoApi } from '@/api/service/login'
import { initDynamicRouter } from '@/routers/modules/dynamicRouter'
import type { ElForm, FormRules } from 'element-plus'
import { HOME_URL } from '@/routers/helper'
import I18n from '@/utils/languages/index'
const { t } = I18n.global

const router = useRouter()
const userStore = useUserStore()
const tabsStore = useTabsStore()
const keepAliveStore = useKeepAliveStore()
const authStore = useAuthStore()
type FormInstance = InstanceType<typeof ElForm>

const loading = ref(false)
const loginForm = reactive<Login.ReqLoginForm>({
    username: '',
    password: '',
})

const loginFormRef = ref<FormInstance>()

const validUsername = ({}: any, value: any, callback: any) => {
    if (!value) {
        return callback(t('login.errorMsg.userName'))
    } else {
        callback()
    }
}
const validPswd = ({}: any, value: any, callback: any) => {
    if (!value) {
        return callback(new Error(t('login.errorMsg.password')))
    } else {
        callback()
    }
}
// 数据校验规则
const loginRules = reactive<FormRules<typeof loginForm>>({
    username: [{ validator: validUsername, trigger: 'blur' }],
    password: [{ validator: validPswd, trigger: 'blur' }],
})

// username: "root",
// password: "#4S@Qr*p4m"
onMounted(() => {
    // 监听 enter 事件（调用登录）
    document.onkeydown = (e: KeyboardEvent) => {
        e = (window.event as KeyboardEvent) || e
        if (e.code === 'Enter' || e.code === 'enter' || e.code === 'NumpadEnter') {
            if (loading.value) return
            login(loginFormRef.value)
        }
    }
})

// login
const login = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
        if (!valid) return
        loading.value = true
        try {
            // 1.执行登录接口
            let params: any = {
                username: loginForm.username,
                password: getEncrypt(loginForm.password), //加密了
            }
            await loginApi(params)
                .then((res: any) => {
                    //存储token
                    userStore.setToken(res.data.token)
                    sessionStorage.setItem('Authorization', res.data.token)
                })
                .finally(() => {
                    loading.value = false
                })

            //2 获取用户信息
            await getUserInfo()
            // 3.清空 tabs、keepAlive 数据
            tabsStore.setTabs([])
            keepAliveStore.setKeepAliveName([])

            //4.添加动态路由
            await initDynamicRouter()

            console.log(HOME_URL, authStore.authMenuListGet, 'authStore.authMenuListGet')

            //5.跳转到首页
            if (authStore.authMenuListGet.length > 0) {
                router.push(authStore.authMenuListGet[0].path)
            } else {
                router.push(HOME_URL)
            }
        } finally {
            loading.value = false
        }
    })
}
// 获取用户信息
const getUserInfo = async () => {
    const { data } = await getUserInfoApi()
    userStore.setUserInfo(data)
}
</script>

<style lang="scss">
.tenant-input .el-select {
    width: 100%;
}

.zdjx-login {
    box-sizing: border-box;
    position: relative;
    width: 100%;
    height: 100%;
    background: #fff url('../../assets/images/login_bg.png') center no-repeat;
    background-size: 100% 100%;

    .content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        justify-content: space-between;
        align-items: center;
        overflow: hidden;
        box-shadow: 0px 2px 12px 0px rgba(29, 112, 245, 0.31);
    }

    .loginLeft {
        width: 50%;
        height: 100%;
        background: #1b48cb url('/src/assets/images/login_left.png') center no-repeat;
        background-size: 100% 100%;
    }

    .loginRight {
        box-sizing: border-box;
        width: 50%;
        height: 100%;
        background-color: #fff;

        .loginRight-logo {
            width: 100%;
            height: 82px;
            margin: 0 auto;
            // background: url('@/assets/images/logo_login.png') center no-repeat;
            // background-size: 100% 100%;
        }

        .loginRight-title {
            font-size: 20px;
            color: #222222;
            text-align: center;
            font-weight: 400;
        }
    }

    .loginForm {
        width: 300px;
        margin: 0 auto;

        .el-form-item__label {
            padding: 0;
            color: #333;
            font-size: 16px;
        }

        .symbol {
            position: absolute;
            top: 8px;
            left: 10px;
            color: #969696;
            font-size: 20px;
        }
        .el-input__inner {
            height: 40px;
            line-height: 40px;
            color: #333;
            font-size: 14px;
            padding-left: 30px;
        }
        .el-input__prefix {
            left: 10px;
            top: 0;
            line-height: 40px;
            color: #999;
            font-size: 18px;
        }
        .el-button {
            width: 100%;
            height: 40px;
            line-height: 40px;
            border-radius: 4px;
            background: #1d70f5;
            border: 1px solid #1d70f5;
            color: #fff;
            font-size: 16px;
            margin-top: 16px;
        }
        .el-button:hover {
            background: #1b48cb;
            border: 1px solid #1b48cb;
        }
    }
}

@media screen and (max-width: 1025px) {
    .content {
        width: 870px;
        height: 408px;
        border-radius: 8px;
    }

    .loginRight-logo {
        width: 232px;
        height: 42px;
        margin: 20px auto 12px auto;
    }

    .loginRight-title {
        margin-bottom: 24px;
    }
}

@media screen and (max-width: 1367px) and (min-width: 1025px) {
    .content {
        width: 1040px;
        height: 480px;
        border-radius: 8px;
    }

    .loginRight-logo {
        width: 232px;
        height: 42px;
        margin: 48px auto 16px auto;
    }

    .loginRight-title {
        margin-bottom: 36px;
    }
}

@media screen and (max-width: 99999px) and (min-width: 1367px) {
    .content {
        width: 1300px;
        height: 600px;
        border-radius: 12px;
    }

    .loginRight-logo {
        width: 328px;
        height: 52px;
        margin: 90px auto 16px auto;
    }

    .loginRight-title {
        margin-bottom: 50px;
    }
}
</style>
