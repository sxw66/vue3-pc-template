import Layout from '@/layout/index.vue'
// 越南权限管理
const authorityRouter = [
  {
    path: '/authority',
    component: Layout,
    redirect: '/authority/company',
    name: 'authority',
    meta: {
      title: '越南权限管理',
      icon: 'Setting',
    },
    children: [
      {
        path: '/authority/company',
        name: 'company',
        meta: { title: '法人公司', icon: 'Ticket' },
        component: () => import('@/views/authority/company/index.vue'),
      },
      {
        path: '/authority/organization',
        component: () => import('@/views/authority/organization/index.vue'),
        name: 'organization',
        meta: { title: '组织管理', icon: 'Management' },
      },
      {
        path: '/authority/menus',
        component: () => import('@/views/authority/menu/index.vue'),
        name: 'menus',
        meta: { title: '菜单管理', icon: 'Menu' },
      },
      {
        path: '/authority/user',
        component: () => import('@/views/authority/user/index.vue'),
        name: 'user',
        meta: { title: '用户管理', icon: 'Avatar' },
      },
      {
        path: '/authority/role',
        component: () => import('@/views/authority/role/index.vue'),
        name: 'role',
        meta: { title: '角色管理', icon: 'User' },
      },
    ],
  },
]

export default authorityRouter
