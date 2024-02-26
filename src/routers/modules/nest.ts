/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'

const nestRouter = [
  {
    path: '/nest',
    component: Layout,
    redirect: '/nest/menu1',
    name: 'nest',
    meta: {
      title: '路由嵌套',
      icon: 'HelpFilled',
    },
    children: [
      {
        path: '/nest/menu1',
        name: 'menu1',
        meta: { title: '菜单1', icon: 'MenuIcon' },
        alwaysShow: true,
        redirect: '/nest/menu1/menu1-1',
        children: [
          {
            path: '/nest/menu1/menu1-1',
            component: () => import('@/views/nest/menu1/menu1-1/index.vue'),
            name: 'menu1-1',
            meta: { title: '菜单 1-1', icon: 'MenuIcon' },
          },
          {
            path: '/nest/menu1/menu1-2',
            component: () => import('@/views/nest/menu1/menu1-2/index.vue'),
            name: 'menu1-2',
            redirect: '/nest/menu1/menu1-2/menu1-2-1',
            meta: { title: '菜单 1-2', icon: 'MenuIcon' },
            children: [
              {
                path: '/nest/menu1/menu1-2/menu1-2-1',
                component: () => import('@/views/nest/menu1/menu1-2/menu1-2-1/index.vue'),
                name: 'menu1-2-1',
                meta: { title: '菜单 1-2-1', icon: 'MenuIcon' },
              },
              {
                path: '/nest/menu1/menu1-2/menu1-2-2',
                component: () => import('@/views/nest/menu1/menu1-2/menu1-2-2/index.vue'),
                name: 'menu1-2-2',
                meta: { title: '菜单 1-2-2', icon: 'MenuIcon' },
              },
            ],
          },
          {
            path: '/nest/menu1/menu1-3',
            component: () => import('@/views/nest/menu1/menu1-3/index.vue'),
            name: 'menu1-3',
            meta: { title: '菜单 1-3', icon: 'MenuIcon' },
          },
        ],
      },
      {
        path: '/nest/menu2',
        component: () => import('@/views/nest/menu2/index.vue'),
        name: 'nest-menu2',
        meta: { title: '菜单2', icon: 'MenuIcon' },
      },
    ],
  },
]

export default nestRouter
