<template>
  <div class="app-container">
    <el-card style="margin-bottom: 10px">
      <template #header>
        <span>按钮上传</span>
      </template>
      <div class="demo-image__preview">
        <div v-for="(item, index) in fileList" class="upload-list">
          <el-image
            style="width: 100%; height: 100%"
            :src="item"
            :preview-src-list="fileList"
            :initial-index="initialIndex"
            fit="cover"
            @click.stop="privew(index)"
          />
        </div>
      </div>
      <el-upload action="/" multiple :before-upload="beforeUploadAction">
        <el-button type="primary">点击上传</el-button>
      </el-upload>
    </el-card>

    <el-card>
      <template #header>
        <span>拖拽上传</span>
      </template>
      <div v-for="(item, index) in fileList1" class="upload-list">
        <el-image
          style="width: 100%; height: 100%"
          :src="item"
          :preview-src-list="fileList1"
          :initial-index="initialIndex1"
          fit="cover"
          @click.stop="privew1(index)"
        />
      </div>
      <el-upload class="upload-demo" drag :before-upload="beforeUploadAction1" action="/" multiple>
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">拖拽上传 <em>或者点击上传</em></div>
      </el-upload>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'

  const initialIndex = ref(0)
  const initialIndex1 = ref(0)
  const fileList = ref([])
  const fileList1 = ref([])

  const privew = (index) => {
    initialIndex.value = index
  }
  const privew1 = (index) => {
    initialIndex.value = index
  }
  const beforeUploadAction = (file, fileLi) => {
    return new Promise((resolve, reject) => {
      var reader = new FileReader()
      let reg = /\.jpg$|\.jpeg$|\.gif$|\.png$/i
      reader.readAsDataURL(file)
      let name = file.name
      if (reg.test(name)) {
        reader.onload = (e: FileReader) => {
          fileList.value.push(e.target.result)
          resolve(e.target.result)
        }
      } else {
        ElMessage.error('请上传图片')
        reject()
      }
    })
  }
  const beforeUploadAction1 = (file, fileLi) => {
    return new Promise((resolve, reject) => {
      var reader = new FileReader()
      let reg = /\.jpg$|\.jpeg$|\.gif$|\.png$/i
      reader.readAsDataURL(file)
      let name = file.name
      if (reg.test(name)) {
        reader.onload = (e: FileReader) => {
          fileList1.value.push(e.target.result)
          resolve(e.target.result)
        }
      } else {
        ElMessage.error('请上传图片')
        reject()
      }
    })
  }
</script>

<style scoped>
  .upload-list {
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    box-sizing: border-box;
    margin: 0 8px 8px 0;
    padding: 0;
    width: 146px;
    height: 146px;
    display: inline-flex;
  }
</style>
