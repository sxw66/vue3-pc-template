<template>
  <div class="base-prop-table-box">
    <div v-if="baseFormColumns.length > 0" class="header">
      <BaseSearchForm
        :columns="baseFormColumns"
        :search-button-list="searchButtonList"
        @onButtonSearch="onButtonSearch"
      >
      </BaseSearchForm>
    </div>

    <!-----------------底部---------------------->
    <div class="footer">
      <!-----------工具栏操作工具----------------->
      <div class="base-prop-table-header">
        <slot name="header"></slot>
      </div>

      <!----------------表格---------------------->
      <div class="table">
        <el-table
          v-loading="loading"
          class="props-table"
          v-bind="attrs"
          :data="tableData"
          :border="true"
        >
          <template v-for="item in baseTableColumns" :key="item.name">
            <el-table-column
              v-if="item.slot"
              v-bind="{ ...item, ...{ prop: item.name } }"
              show-overflow-tooltip
            >
              <template #default="scope">
                <slot :name="item.name" :item="item" :row="scope.row"></slot>
              </template>
            </el-table-column>
            <!-- 默认操作方式 -->
            <el-table-column
              v-else-if="item.name === 'operator'"
              v-bind="{ ...item, ...{ prop: item.name } }"
            >
              <template #default="scope">
                <div class="base-prop-table-operator">
                  <el-button
                    v-for="el in item?.options || []"
                    :key="el?.name"
                    class="operator-btn"
                    :type="el?.type"
                    :link="el?.link"
                    :icon="el?.icon"
                    :size="el?.size"
                    @click.stop="onColumnOperation(el, scope.row, scope.$index)"
                  >
                    {{ el?.label }}
                  </el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-else
              v-bind="{ ...item, ...{ prop: item.name } }"
              show-overflow-tooltip
            />
          </template>
          <template #empty>
            <BaseEmpty />
          </template>
        </el-table>
      </div>
      <!---------------分页--------------->
      <slot name="footer">
        <div v-if="isShowPagination" class="pagination-box">
          <el-pagination
            v-bind="attrs"
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="pageSizes"
            :background="background"
            :layout="layout"
            :total="total"
            @current-change="(val) => emit('current-page-change', val)"
            @change="(val) => emit('pagination-change', val)"
          />
        </div>
      </slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineAsyncComponent, computed, useAttrs } from "vue";

// 基础搜索表单
const BaseSearchForm = defineAsyncComponent(
  () => import("@/components/base-search-form/index.vue")
);
// 内容为空
const BaseEmpty = defineAsyncComponent(() => import("@/components/base-empty/index.vue"));
// 透传属性
const attrs = useAttrs();

interface ItemProps<T> {
  [key: string]: T;
}
interface Props {
  columns?: ItemProps<any>[];
  data?: ItemProps<any>[];
  loading?: boolean;
  isShowPagination?: boolean;
  currentPage?: number;
  pageSize?: number;
  pageSizes?: number[];
  background?: boolean;
  layout?: string;
  total?: number;
  searchButtonList?: any[];
}

const props = withDefaults(defineProps<Props>(), {
  columns: () => [],
  data: () => [],
  searchButtonList: () => [
    { type: "", text: "重置" },
    { type: "primary", text: "查询" },
    { type: "success", text: "新增" },
  ],
  loading: false,
  isShowPagination: true,
  currentPage: 1,
  pageSize: 10,
  pageSizes: () => [10, 20, 50, 100],
  background: true,
  layout: "total, sizes, prev, pager, next, jumper",
  total: 0,
});

const emit = defineEmits([
  "form-operation",
  "column-operation",
  "current-page-change",
  "pagination-change",
]);

const currentPage = computed(() => props.currentPage);
const pageSize = computed(() => props.pageSize);

// 过滤调currentPage需要进行搜索选择的.currentPage
const baseFormColumns = computed(() => {
  return props.columns.filter((item: any) => item.valueType && item.search);
});

// 过滤掉，需要搜索的，不需要展示在表格列中的表单，
const baseTableColumns = computed(() => {
  return props.columns.filter((item: any) => !item.hide);
});

const tableData = computed(() => {
  return props.data && props.data.length > 0
    ? JSON.parse(JSON.stringify(props.data))
    : [];
});

// 当前行操作
const onColumnOperation = (btn, row, index) => {
  emit("column-operation", btn, row, index);
};
// 表单按钮操作事件
const onButtonSearch = (formParams, btnTypes) => {
  emit("form-operation", formParams, btnTypes);
};
</script>

<style scoped lang="scss">
.base-prop-table-box {
  height: calc(100% - 2px);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  .header {
    display: flex;
    padding-top: 16px;
    border-radius: 4px;
    background: white;
    /* box-shadow: 0 0 12px rgb(0 0 0 / 5%); */
    :deep(.advancedForm) {
      flex: 1;
    }
  }
  .footer {
    flex: 1;
    display: flex;
    flex-direction: column;
    border-radius: 4px;
    overflow: hidden;
    background: white;
    /* box-shadow: 0 0 12px rgb(0 0 0 / 5%); */
    min-height: 300px;
    .base-prop-table-header {
      margin-bottom: 15px;
    }
    .table {
      position: relative;
      flex: 1;
    }
    .props-table {
      position: absolute;
      height: 100%;
    }
  }
  ::v-deep(.el-table__header th) {
    font-size: 15px;
    font-weight: 700;
    color: #252525;
  }
  .pagination-box {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    padding-top: 20px;
    box-sizing: border-box;
  }
}
</style>
