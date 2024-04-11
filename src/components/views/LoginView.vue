<template>
    <el-card class="login-card">
        <h1>Login</h1>
        <el-form @submit.prevent="handleLogin" :model="loginForm" :rules="loginRules" ref="loginFormsss" label-position="left" label-width="80px">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="loginForm.username" placeholder="输入用户名" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" native-type="submit">登录</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
import { defineComponent,reactive,ref } from 'vue';
import { ElCard, ElForm, ElFormItem, ElInput, ElButton } from 'element-plus';
import { useRouter } from 'vue-router';

export default defineComponent({
components: {
    ElCard,
    ElForm,
    ElFormItem,
    ElInput,
    ElButton
},
setup() {
    const router = useRouter();
    const loginFormsss = ref(null);

    const loginForm = reactive({
        username: ''
    });

    const loginRules = {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
    };

    const handleLogin = () => {
        console.log(loginForm);
        if (loginForm.username === 'admin') {
            // 跳转到 IndexView 页面
            router.push('/index');
        } else {
            // 跳转到 TaskProcessors 页面
            router.push({ path: '/task-processors', query: {username: loginForm.username}});
        }
    };

    return {
        loginForm,
        loginRules,
        handleLogin,
        loginFormsss
    };
}
});
</script>

<style scoped>
    .login-card {
        width: 360px;
        max-width: 90%;
        margin: 40px auto;
        padding: 32px;
        border-radius: 8px;
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
        background-color: #ffffff;
    }

    .login-card h1 {
        text-align: center;
        font-size: 24px;
        margin-bottom: 24px;
    }

    .login-card .el-form {
        width: 100%;
    }

    .login-card .el-form-item {
        margin-bottom: 16px;
    }

    .login-card .el-button {
        width: 100%;
    }
</style>