// /** When your routing table is too long, you can split it into small modules**/
import Layout from '@/layout/index.vue'
// 越南权限管理
const BomRouter = [
  {
    path: '/bom',
    component: Layout,
    redirect: '/bom/inventory',
    name: 'bom',
    meta: {
      title: 'BOM管理',
      icon: 'Setting',
    },
    children: [
      {
        path: '/bom/inventory',
        component: () => import('@/views/bom/inventory/index.vue'),
        name: 'inventory',
        meta: { title: 'BOM清单', icon: 'Ticket' },
      },
      {
        path: '/bom/inventory/template',
        component: () => import('@/views/bom/inventory/template/index.vue'),
        name: 'BomInventoryTemplate',
        hidden: true,
        // keepAlive设为true时，路由跳转的页面每次打开页面数据一直是第一次缓存的数据
        meta: { title: 'BOM模板', icon: 'MenuIcon', keepAlive: false },
      },
    ],
  },
]

export default BomRouter
