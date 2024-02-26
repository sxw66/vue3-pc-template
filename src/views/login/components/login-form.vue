<template>
  <div class="login-title">
    <img class="icon" src="@/assets/images/logos/black.png" alt="logo" />
    <h2 class="title">杉川 MES</h2>
  </div>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules">
    <el-form-item prop="">
      <el-select
        v-model="selectedItem"
        class="login-select-item"
        placeholder="请选择"
        value-key="id"
        size="large"
        @change="handeSearchCompany"
      >
        <el-option v-for="item in companOptions" :key="item.id" :label="item.companyName" :value="item" filterable />
      </el-select>
    </el-form-item>

    <el-form-item label="" prop="username">
      <el-input
        v-model="ruleForm.username"
        placeholder="请输入用户名"
        auto-complete="on"
        style="position: relative"
        @keyup.enter="submitForm(ruleFormRef)"
      >
        <template #prefix>
          <el-icon class="el-input__icon"><UserFilled /></el-icon>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item label="" prop="password">
      <el-input
        v-model="ruleForm.password"
        placeholder="请输入密码"
        auto-complete="on"
        :type="passwordType"
        @keyup.enter="submitForm(ruleFormRef)"
      >
        <template #prefix>
          <el-icon class="el-input__icon"><GoodsFilled /></el-icon>
        </template>
        <template #suffix>
          <div class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </div>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item style="width: 100%">
      <el-button :loading="loading" class="login-btn" type="primary" @click="submitForm(ruleFormRef)">登录</el-button>
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue'
  import type { FormInstance } from 'element-plus'
  import { ElNotification } from 'element-plus'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/store/modules/user'
  import { getTimeStateStr } from '@/utils/index'
  import { getCompaniesList } from '@/api/login'

  const router = useRouter()
  const UserStore = useUserStore()
  const ruleFormRef = ref<FormInstance>()
  const passwordType = ref('password')
  const loading = ref(false)
  const companOptions = ref([])
  const selectedItem = ref(null)

  const rules = reactive({
    password: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    username: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  })

  // 表单数据
  const ruleForm = reactive({
    username: '10000',
    password: 'dym201912',
    companyId: '',
    companyType: false,
  })

  // 显示密码图标
  const showPwd = () => {
    passwordType.value = passwordType.value === 'password' ? '' : 'password'
  }

  // 下拉选择-法人公司
  const handeSearchCompany = (items) => {
    ruleForm.companyId = items.id
    ruleForm.companyType = items.companyType
  }

  const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
      if (valid) {
        loading.value = true
        // 登录
        // let res: any = await UserStore.login(ruleForm);
        // if (res.data) {
        //   console.log("resresres", res);
        //   router.push({
        //     path: "/",
        //   });
        //   ElNotification({
        //     title: getTimeStateStr(),
        //     message: "欢迎登录 MES系统",
        //     type: "success",
        //     duration: 3000,
        //   });
        // }
        // loading.value = false;
        // 登录
        setTimeout(async () => {
          await UserStore.login(ruleForm)
          await router.push({
            path: '/',
          })
          ElNotification({
            title: getTimeStateStr(),
            message: '欢迎登录 MES系统',
            type: 'success',
            duration: 3000,
          })
          loading.value = true
        }, 1000)
      } else {
        console.log('error submit!')
        return false
      }
    })
  }
  // 获取公司列表
  const handleGettCompanList = async () => {
    const { data, code } = await getCompaniesList()
    if (data.length && code === 0) {
      companOptions.value = data
    }
  }
  onMounted(async () => {
    // // 初始化-获取公司列表
    // await handleGettCompanList();
    // // 初始化-设置默认选中第一个选项
    // selectedItem.value = companOptions.value[0];
    // ruleForm.companyId = companOptions.value[0].id;
    // ruleForm.companyType = companOptions.value[0].companyType;
  })
</script>

<style lang="scss" scoped>
  @import '../index.scss';
</style>
