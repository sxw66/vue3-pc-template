<template>
  <!-- 结果JSON 数组 -->
  <el-tabs v-model="activeName" class="api-request-table">
    <el-tab-pane label="Params" name="Params">
      <el-table :data="state.parmsData" style="width: 100%" border>
        <el-table-column prop="parmsname" label="参数名">
          <template #default="scope">
            <el-input v-model="scope.row.parmsname" placeholder="key" @change="updateParmsFormData(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="parmsval" label="值">
          <template #default="scope">
            <el-input v-model="scope.row.parmsval" placeholder="value" @change="updateParmsFormData(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" :icon="Plus" @click="addParameter('Params')"></el-button>
            <!--  v-if="showBtn(scope.$index)" -->
            <el-button type="danger" size="small" :icon="Minus" @click="deleteParameter(scope.$index, 'Params')"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="Header" name="Header">
      <el-table :data="state.tableData2" style="width: 100%" border highlight-current-row>
        <el-table-column prop="headers" label="响应头">
          <template #default="scope">
            <el-input v-model="scope.row.headers" placeholder="key" @change="updateHeaderFormData(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="值">
          <template #default="scope">
            <el-input v-model="scope.row.price" placeholder="value" @change="updateHeaderFormData(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" :icon="Plus" @click="addParameter"></el-button>
            <el-button type="danger" size="small" :icon="Minus" @click="deleteParameter(scope.$index, null)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="Body" name="Body">
      <div>
        <v-ace-editor
          v-if="activeName === 'Body'"
          ref="aceEditor"
          v-model:value="dataForm.textareashow"
          lang="json"
          :theme="aceConfig.theme"
          :options="aceConfig.options"
          :readonly="aceConfig.readOnly"
          style="height: 300px"
          class="ace-editor"
          @init="jsonFormat"
          @blur="onJsonBlur"
        />
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, computed, watchEffect, defineAsyncComponent } from 'vue'
  import { User, Plus, Minus } from '@element-plus/icons-vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { VAceEditor } from 'vue3-ace-editor'
  // 语法提示工具
  import 'ace-builds/src-noconflict/mode-json'
  import 'ace-builds/src-noconflict/theme-chrome'
  import 'ace-builds/src-noconflict/ext-language_tools'
  import workerJsonUrl from 'ace-builds/src-noconflict/worker-json?url' // For vite
  import ace from 'ace-builds'
  ace.config.setModuleUrl('ace/mode/json_worker', workerJsonUrl)

  //分发事件给父组件
  let emits = defineEmits(['handeParmsFormData'])

  const activeName = ref('Params')

  const state = reactive({
    // 普通参数
    parmsData: [
      {
        parmsname: '',
        parmsval: '',
      },
    ],
    // 响应头
    tableData2: [
      {
        headers: '',
        price: '',
      },
    ],
    // JSON参数
    ParmsObjectData: {},
    HeaderObjectData: {},
  })
  //ace编辑器配置
  const aceConfig = reactive({
    lang: 'json', //解析json
    theme: 'chrome', //主题
    arr: [
      /*所有主题*/
      'ambiance',
      'chaos',
      'chrome',
      'clouds',
      'clouds_midnight',
      'cobalt',
      'crimson_editor',
      'dawn',
      'dracula',
      'dreamweaver',
      'eclipse',
      'github',
      'gob',
      'gruvbox',
      'idle_fingers',
      'iplastic',
      'katzenmilch',
      'kr_theme',
      'kuroir',
      'merbivore',
      'merbivore_soft',
      'monokai',
      'mono_industrial',
      'pastel_on_dark',
      'solarized_dark',
      'solarized_light',
      'sqlserver',
      'terminal',
      'textmate',
      'tomorrow',
      'tomorrow_night',
      'tomorrow_night_blue',
      'tomorrow_night_bright',
      'tomorrow_night_eighties',
      'twilight',
      'vibrant_ink',
      'xcode',
    ],
    readOnly: false, //是否只读
    options: {
      useWorker: true,
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true,
      tabSize: 2,
      showPrintMargin: false,
      fontSize: 15,
    },
  })

  //form
  const dataForm = reactive({
    Example: {
      abc: '123',
      def: '345',
      ghi: {
        abc: '123',
        def: '345',
      },
      jkl: [
        {
          abc: '123',
          def: '345',
        },
        {
          abc: '123',
          def: '345',
        },
      ],
    },
    textareashow: '',
  })

  const jsonError = (e) => {
    console.log(`JSON字符串错误：${e.message}`)
  }

  // JSON格式化
  const jsonFormat = () => {
    try {
      dataForm.textareashow = JSON.stringify(dataForm.Example, null, 2)
    } catch (e) {
      jsonError(e)
    }
  }

  // JSON压缩
  const jsonNoFormat = () => {
    try {
      dataForm.textareashow = JSON.stringify(JSON.parse(dataForm.textareashow))
    } catch (e) {
      jsonError(e)
    }
  }

  // 添加一行参数
  const addParameter = (tabs) => {
    if (tabs === 'Params') {
      state.parmsData.push({
        parmsname: '',
        parmsval: '',
      })
    } else {
      state.tableData2.push({
        headers: '',
        price: '',
      })
    }
    updateHeaderFormData()
    updateParmsFormData()
  }

  // 删除指定索引的参数
  const deleteParameter = (index, tabs) => {
    if (tabs) {
      state.parmsData.splice(index, 1)
      state.parmsData?.forEach((item) => {
        state.ParmsObjectData = {}
        state.ParmsObjectData[item.parmsname] = item.parmsval
      })
      state.tableData2?.forEach((item) => {
        state.HeaderObjectData[item.headers] = item.price
      })
    } else {
      state.tableData2?.splice(index, 1)
      state.tableData2?.forEach((item) => {
        state.HeaderObjectData = {}
        state.HeaderObjectData[item.headers] = item.price
      })
      state.parmsData?.forEach((item) => {
        state.ParmsObjectData[item.parmsname] = item.parmsval
      })
    }
    emits('handeParmsFormData', state.ParmsObjectData, state.HeaderObjectData, dataForm.textareashow)
  }

  // 表格搜索参数-【普通参数】
  const updateParmsFormData = (val) => {
    console.log('表格搜索提交值', val)
    state.parmsData.forEach((item) => {
      if (item.parmsval) {
        state.ParmsObjectData[item.parmsname] = item.parmsval
      }
    })
    emits('handeParmsFormData', state.ParmsObjectData, state.HeaderObjectData, dataForm.textareashow)
  }
  // 表格搜索参数-【请求头参数】
  const updateHeaderFormData = (val) => {
    state.tableData2.forEach((item) => {
      if (item.price) {
        state.HeaderObjectData[item.headers] = item.price
        console.log('请求头参数', item)
      }
    })
    emits('handeParmsFormData', state.ParmsObjectData, state.HeaderObjectData, dataForm.textareashow)
  }
  // 表格搜索参数-【body模式】-输入项改变事件
  const onJsonBlur = (val, aaa) => {
    // vue3-ace-editor
    try {
      JSON.parse(dataForm.textareashow)
      ElMessage.success('JSON 格式正确')
      emits('handeParmsFormData', state.ParmsObjectData, state.HeaderObjectData, dataForm.textareashow)
    } catch (error) {
      console.error('error', error)
      const errorMessage = `JSON 格式错误：${error.message}`
      ElMessage.error(errorMessage)
    }
  }
  // 初始化函数
  onMounted(() => {})
</script>

<style lang="scss" scoped>
  .api-request-table {
    width: 100%;
  }
</style>
