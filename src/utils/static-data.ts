import { ref } from 'vue'
import {
  DocumentCopy,
  Edit,
  User,
  Plus,
  Delete,
  Operation,
  Setting,
  Aim,
  RefreshLeft,
  Promotion,
  EditPen,
  Switch,
  Timer,
  DataLine,
  PriceTag,
  CollectionTag,
  Connection,
  Menu,
  Paperclip,
} from '@element-plus/icons-vue'
// API系统管理-输入表单-方法静态数据
export const methodOptions = [
  {
    value: 'GET',
    label: 'GET',
  },
  {
    value: 'POST',
    label: 'POST',
  },
  {
    value: 'PUT',
    label: 'PUT',
  },
  {
    value: 'DELETE',
    label: 'DELETE',
  },
  {
    value: 'PATCH',
    label: 'PATCH',
  },
]

export const protocolTypeOptions = [
  {
    value: 'http',
    label: 'http',
  },
  {
    value: 'https',
    label: 'https',
  },
  {
    value: 'service',
    label: 'service',
  },
]
