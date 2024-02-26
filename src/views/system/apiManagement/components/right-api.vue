<template>
  <!-- 右侧API 输出页 -->
  <el-form ref="ruleFormRef" :model="importForm" label-width="80px" class="left-api-form">
    <el-form-item label="唯一标识">
      <el-input v-model="importForm.uniqueName"></el-input>
    </el-form-item>
    <el-form-item label="接口名称">
      <el-input v-model="importForm.name"></el-input>
    </el-form-item>
    <el-form-item>
      <div class="operation">
        <el-select v-model="importForm.method">
          <el-option v-for="item in methodOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
        <el-select v-model="importForm.protocolType" class="spacing-mg" placeholder="请选择服务类型">
          <el-option v-for="item in protocolTypeOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
        <el-input v-model="importForm.requestUrl"></el-input>
      </div>
    </el-form-item>
    <el-form-item>
      <!-- 前置 触发 接口 -->
      <div v-for="(domain, index) in beforeValidateForm" :key="domain.key" class="operation">
        <span>前置 触发 接口</span>
        <el-select v-model="domain.beforelinks" class="margin-10" @change="handeApiSelect">
          <el-option v-for="item in authOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
        <el-button type="primary" @click="handeBeforedAdd">增加</el-button>
        <el-button v-if="domain.isDel" type="danger" @click.prevent="handeBeforedRemove(domain)">删除</el-button>
      </div>
      <!-- 后置 触发 接口 -->
      <div v-for="(domain, index) in laterValidateForm" :key="domain.key" class="operation">
        <span>后置 触发 接口</span>
        <el-select v-model="domain.afterlinks" class="margin-10" @change="handeApiSelect">
          <el-option v-for="item in authOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
        <el-button type="primary" @click="handeBehindAdd">增加</el-button>
        <el-button v-if="domain.isDel" type="danger" @click.prevent="handeBehindRemove(domain)">删除</el-button>
      </div>
    </el-form-item>
    <el-form-item>
      <div class="execution-result">预执行结果</div>
      <el-tag effect="dark">JSON 查看</el-tag>
    </el-form-item>
    <el-form-item>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="key" label="Key"></el-table-column>
        <el-table-column prop="value" label="Value"></el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <div class="import-btn">
        <el-button type="danger" @click="handeCancele">取消</el-button>
        <el-button type="primary" @click="handeOnSave">保存</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
  import { ref, toRaw, reactive, onMounted, computed, watchEffect, defineAsyncComponent } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import type { FormInstance, FormRules } from 'element-plus'
  import { methodOptions, protocolTypeOptions } from '@/utils/static-data'
  import { pageinterfaceList } from '@/api/system/index'

  interface RuleForm {
    name?: string
    uniqueName?: string
    method?: string
    protocolType?: string
    requestUrl?: string
    apiTriggerIds?: string[]
  }
  //分发事件给父组件
  let emits = defineEmits(['handleRightBack'])

  const ruleFormRef = ref<FormInstance>()
  const rules = reactive<FormRules<RuleForm>>({
    // labelName: [
    //   { required: true, message: "请输入标签名称", trigger: "blur" },
    //   { min: 1, max: 30, message: "长度在3到30位", trigger: "blur" },
    // ],
  })

  // API系统管理-输入表单数据
  const importForm = reactive<RuleForm>({
    name: '',
    uniqueName: '',
    method: '',
    protocolType: '',
    requestUrl: '',
    apiTriggerIds: [], // 存储前置后置选择的数据数组
  })

  // 前置下拉数据
  const beforeValidateForm = ref([
    {
      beforelinks: '',
      isDel: false, // 是否可删除
    },
  ])
  // 后置下拉数据
  const laterValidateForm = ref([
    {
      afterlinks: '',
      isDel: false, // 是否可删除
    },
  ])

  // 获取前置后置触发接口列表
  const authOptions = ref([])
  // 转换后的表格数据
  const tableData = ref([])

  // 【前置后置】下拉选择
  const handeApiSelect = (value) => {
    importForm.apiTriggerIds.push(value)
    // 使用 Set 对象去除重复项
    importForm.apiTriggerIds = Array.from(new Set(importForm.apiTriggerIds))
    console.log('【前置后置】下拉选择', importForm.apiTriggerIds)
  }
  // 新增-前置接口
  const handeBeforedAdd = (value) => {
    beforeValidateForm.value.push({
      beforelinks: '',
      isDel: true,
    })
  }
  // 删除-前置接口
  const handeBeforedRemove = (item) => {
    const index = beforeValidateForm.value.indexOf(item)
    if (index !== -1) {
      beforeValidateForm.value.splice(index, 1)
    }
  }
  // 新增-后置接口
  const handeBehindAdd = (value) => {
    laterValidateForm.value.push({
      afterlinks: '',
      isDel: true,
    })
  }
  // 删除-后置接口
  const handeBehindRemove = (item) => {
    const index = laterValidateForm.value.indexOf(item)
    if (index !== -1) {
      laterValidateForm.value.splice(index, 1)
    }
  }
  // 取消
  const handeCancele = async () => {
    emits('handleRightBack')
  }
  // 保存API数据
  const handeOnSave = (item) => {
    const apiData = {
      ...importForm,
      apiTriggerIds: toRaw(importForm.apiTriggerIds),
      // params: this.objParms,
      // headers: this.objHeader,
      // body: this.objJson,
    }
    console.log('保存', apiData)
  }
  // 获取表格列表数据
  const getTriggerList = async () => {
    let params = {
      tenantId: '',
      pageNum: 1,
      pageSize: -1,
    }
    const { data, code } = await pageinterfaceList(params)
    if (code === 0) {
      authOptions.value = data.records.map((item) => {
        return { label: item.name, value: item.id }
      })
    }
  }
  // 将JSON数据转换为Element Plus表格的数据
  const convertJsonToTableData = (jsonData) => {
    const restData = []
    for (const key in jsonData) {
      const row = {
        key: key,
        value: jsonData[key],
      }
      restData.push(row)
    }
    return restData
  }

  // 初始化
  onMounted(() => {
    getTriggerList()
    // =================================
    // 使用示例
    const jsonData = {
      id: '173012',
      uniqueName: '输出',
      tenantId: 'a',
      protocolType: 'https',
      method: 'POST',
      requestUrl: 'test-web-mall.3i-ai.com:8443/api/imall-ums/auth/login',
      headers: '{\r\n\r\n\t"Tenantid": "1528911334443982848"\r\n}',
      pattern: 1,
      body: '{\r\n    "username": "admin",\r\n    "password": "Mall12345678"\r\n}',
      status: 1,
      createTime: 1701332268000,
      updateTime: 1702534544000,
    }
    // 在组件挂载后将JSON数据转换为表格数据并赋值给tableData
    tableData.value = convertJsonToTableData(jsonData)
  })
</script>

<style lang="scss" scoped>
  .left-api-form {
    .operation {
      display: flex;
      align-items: center;
      width: 100%;
      .el-select--default {
        min-width: 200px;
        width: 200px;
      }
      .spacing-mg {
        margin: 0 10px;
      }
      .margin-10 {
        margin: 5px 10px;
      }
    }
    .execution-result {
      margin-right: 30px;
    }
    .import-btn {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: 100%;
    }
  }
</style>
