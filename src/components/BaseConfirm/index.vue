<!-- 勾选确认 -->
<template>
  <el-dialog v-model="visible" title="提示" width="400px" top="18%" @close="close">
    <el-form ref="delFormRef" :model="Form" :rules="rules">
      <el-form-item label="" prop="checked">
        <el-icon style="font-size: 20px; color: #e6a23c; margin-right: 10px"><WarningFilled /></el-icon>
        <el-checkbox-group v-model="Form.checked">
          <el-checkbox :label="label" name="type" />
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch, computed } from 'vue'
  import type { FormRules } from 'element-plus'

  export interface Props {
    modelValue?: boolean
    label?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    label: '请再次确认删除操作',
    text: '确认是否 删除',
  })

  const emit = defineEmits(['update:modelValue', 'cancel', 'submit'])

  const delFormRef: any = ref(null)

  const Form: any = reactive({
    checked: [],
  })

  const rules = reactive<FormRules>({
    checked: [
      {
        required: true,
        message: '请先勾选确认',
        trigger: 'change',
      },
    ],
  })

  const visible = computed({
    get: () => props.modelValue,
    set: (value: boolean) => {
      emit('update:modelValue', value)
    },
  })

  watch(
    () => props.modelValue,
    (newVal: boolean) => {
      visible.value = newVal
    },
    {
      immediate: true,
    },
  )

  // 重置表单
  const resetForm = () => {
    if (!delFormRef.value) return
    delFormRef.value.resetFields()
  }

  // 关闭弹框
  const close = () => {
    visible.value = false
    resetForm()
  }

  // 取消按钮弹框
  const cancel = () => {
    visible.value = false
    resetForm()
    emit('cancel')
  }
  // 提交
  const submit = async () => {
    console.log(delFormRef.value, 'delFormRef.value')
    if (!delFormRef.value) return
    await delFormRef.value.validate((valid: any, fields: any) => {
      if (valid) {
        emit('submit')
      } else {
        console.log('error submit!', fields)
      }
    })
  }
</script>
