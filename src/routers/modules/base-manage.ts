import Layout from '@/layout/index.vue'
// 基础管理
const baseManagementRouter = [
  {
    path: '/base',
    component: Layout,
    redirect: '/base/materialRelationship',
    name: 'baseManage',
    meta: {
      title: '基础管理',
      icon: 'Connection',
    },
    children: [
      {
        path: '/base/materialRelationship',
        name: 'baseMaterialRelationshipList',
        meta: { title: '物料关系', icon: 'Link' },
        component: () => import('@/views/basicManagement/materialRelationship/index.vue'),
      },
      {
        path: '/base/standardWorkForce',
        component: () => import('@/views/basicManagement/standardWorkForce/index.vue'),
        name: 'standardWorkHourList',
        meta: { title: '标准工时', icon: 'DataAnalysis' },
      },
    ],
  },
]

export default baseManagementRouter
