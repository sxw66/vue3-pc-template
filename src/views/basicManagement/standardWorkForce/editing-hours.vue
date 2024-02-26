<template>
  <!-- 编辑标准工时 -->
  <el-dialog v-if="props.hoursVisible" v-model="props.hoursVisible" title="编辑" :before-close="handleCancel">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" status-icon>
      <el-form-item label="ID" prop="id">
        <el-input v-model="ruleForm.id" placeholder="ID" disabled></el-input>
      </el-form-item>
      <el-form-item label="物料编码" prop="materialNo">
        <el-input v-model="ruleForm.materialNo" placeholder="物料编码" disabled></el-input>
      </el-form-item>
      <el-form-item label="机型" prop="deviceType">
        <el-input v-model="ruleForm.deviceType" placeholder="机型" disabled></el-input>
      </el-form-item>
      <el-form-item label="客户" prop="customer">
        <el-input v-model="ruleForm.customer" placeholder="客户" disabled></el-input>
      </el-form-item>
      <el-form-item label="工段" prop="section">
        <el-select v-model="ruleForm.section" style="width: 100%" disabled>
          <el-option v-for="item in workshopSectionList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="直接人力" prop="directHuman">
        <el-input v-model="ruleForm.directHuman" placeholder="直接人力"></el-input>
      </el-form-item>
      <el-form-item label="间接人力" prop="indirectHuman">
        <el-input v-model="ruleForm.indirectHuman" placeholder="间接人力"></el-input>
      </el-form-item>
      <el-form-item label="标准产能" prop="standardCapacity">
        <el-input v-model="ruleForm.standardCapacity" placeholder="标准产能"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="note">
        <el-input v-model="ruleForm.note" type="textarea" rows="4" placeholder="备注" maxlength="300" show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="submitForm"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, computed, watch, watchEffect } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import type { FormInstance, FormRules } from 'element-plus'
  import { GetCascadeMaterialList, UpdateMaterialList } from '@/api/basic-management/material-relationship'

  // 接收父组件传递的参数
  const props = defineProps({
    hoursVisible: Boolean,
    EditFormData: Object,
  })

  //分发事件给父组件
  let emits = defineEmits(['closeHoursVisible'])

  interface RuleForm {
    id: string
    materialNo: string
    customer: string
    deviceType: string
    section: string
    directHuman: string
    indirectHuman: string
    standardCapacity: string
    note: string
  }
  const ruleFormRef = ref<FormInstance>()
  const ruleForm = reactive<RuleForm>({
    id: '',
    materialNo: '',
    deviceType: '',
    customer: '',
    section: '',
    directHuman: '',
    indirectHuman: '',
    standardCapacity: '',
    note: '',
  })

  const rules = reactive<FormRules<RuleForm>>({
    id: [{ required: true, message: '请输入', trigger: 'blur' }],
    materialNo: [{ required: true, message: '请输入', trigger: 'blur' }],
    // materialNo: [{ required: true, message: "请选择", trigger: "change" }],
  })

  // 物料工位列表
  const workshopSectionList = ref([
    { id: 1, name: 'DIP' },
    { id: 2, name: '超声' },
    { id: 3, name: '风机' },
    { id: 4, name: '雷达' },
    { id: 5, name: '装配' },
    { id: 6, name: '组件' },
  ])

  // 获取父成品列表列表数据
  const GetParentProductListData = async () => {
    let params = {
      isInvolvedManHour: 1,
      isLineUse: 0,
    }
    const { data, code } = await GetCascadeMaterialList(params)
    console.log('-获取父成品列表列表数据', data)
    //   if (code === 0) {
    //     tableInfo.list = data?.records || [];
    //     tableParams.value.total = data?.total || 0;
    //   }
    //   tableInfo.loading = false;
  }

  //  提交
  const submitForm = async () => {
    try {
      const valid = await ruleFormRef.value?.validate()
      if (!valid) {
        return
      }
      const formValue = ruleForm
      console.log('提交校验通过', formValue)
      const { code, data } = formValue.id ? await UpdateMaterialList(formValue) : await UpdateMaterialList(formValue)
      if (code === 0) {
        const message = formValue.id ? '编辑成功' : '新增成功'
        ElMessage.success({
          showClose: true,
          message: message,
        })
        ruleFormRef.value.resetFields()
        emits('closeHoursVisible', true)
      }
    } catch (error) {
      console.log('error submit!')
    }
  }

  // 关闭-取消
  const handleCancel = () => {
    ruleFormRef.value.resetFields()
    emits('closeHoursVisible', '')
  }
  // 默认获取父组件传递的树列表-和表格数据-依赖项变化的时候，重新执行改函数。
  watchEffect(() => {
    if (props.EditFormData) {
      Object.assign(ruleForm, props.EditFormData)
    }
  })
  onMounted(() => {
    // GetParentProductListData()
  })
</script>

<style lang="scss" scoped>
  .prefix-icon {
    border-style: dashed;
    color: #cacaca;
    border-color: #cacaca;
    border-width: 1px;
    border-radius: 50%;
    line-height: 1;
  }
</style>
