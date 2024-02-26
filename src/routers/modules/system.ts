import Layout from '@/layout/index.vue'

const systemRouter = [
  {
    path: '/system',
    component: Layout,
    redirect: '/system/api/manage',
    name: 'system',
    meta: {
      title: 'API系统管理',
      icon: 'HelpFilled',
    },
    children: [
      {
        path: '/system/api/manage',
        component: () => import('@/views/system/apiManagement/index.vue'),
        name: 'Manage',
        meta: { title: 'API管理列表', icon: 'Lollipop' },
      },
      {
        path: '/system/api/trigger',
        component: () => import('@/views/system/triggerManagement/index.vue'),
        name: 'Trigger',
        meta: { title: 'API触发器列表', icon: 'List' },
      },
    ],
  },
]

export default systemRouter
