export default [
  {
    path: '/home',
    name: 'home',
    component: () => import('@/layout/Layout'),
    alwaysShow: true,
    meta: { title: '企业看板', icon: 'develop' },
    icon: 'develop',
    sort: '1',
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/home'),
        meta: { title: '首页', icon: 'validCode' },
        icon: 'validCode',
        sort: '1',
      }
    ],
  },
  {
    path: '/employee',
    name: 'employee',
    redirect: 'employee',
    component: () => import('@/layout/Layout'),
    meta: { title: '员工档案', icon: 'user' },
    icon: 'user',
    sort: '2',
    children: [
      {
        path: 'message',
        name: 'message',
        component: () => import('@/views/employee/base/index'),
        meta: { title: '基本信息', icon: 'index' },
        icon: 'index',
        sort: '21',
      },
      {
        path: 'detail',
        name: 'detail',
        component: () => import('@/views/employee/detail/index'),
        meta: { title: '详细信息', icon: 'user1' },
        icon: 'user1',
        sort: '22',
      }
    ],
  },
  {
    path: '/attendance',
    name: 'attendance',
    component: () => import('@/layout/Layout'),
    alwaysShow: true,
    meta: { title: '考勤管理', icon: 'peoples' },
    icon: 'peoples',
    sort: '3',
    children: [
      {
        path: '/statistics',
        name: 'statistics',
        component: () => import('@/views/attendance/statistics/index'),
        meta: { title: '考勤统计', icon: 'peoples' },
        icon: 'peoples',
        sort: '31',
        children: [
          {
            path: 'summary',
            name: 'summary',
            component: () => import('@/views/attendance/statistics/summary'),
            meta: { title: '月度汇总', icon: 'peoples' },
            icon: 'peoples',
            sort: '32',
          },
          {
            path: 'date',
            name: 'date',
            component: () => import('@/views/attendance/statistics/date/index'),
            meta: { title: '打卡时间', icon: 'peoples' },
            icon: 'peoples',
            sort: '33',
          },
          {
            path: 'card',
            name: 'card',
            component: () => import('@/views/attendance/statistics/card/index'),
            meta: { title: '考勤记录', icon: 'peoples' },
            icon: 'peoples',
            sort: '34',
          }
        ],
      }
    ],
  },
  {
    path: '/disk',
    name: 'disk',

    component: () => import('@/layout/Layout'),
    alwaysShow: true,
    meta: { title: '云盘中心', icon: 'dictionary' },
    icon: 'dictionary',
    sort: '4',
    children: [
      {
        path: 'company',
        name: 'company',
        component: () => import('@/views/disk/company/index'),
        meta: { title: '公司文件', icon: 'dictionary' },
        icon: 'dictionary',
        sort: '41',
      },
      {
        path: 'search',
        name: 'search',
        component: () => import('@/views/disk/search/index'),
        meta: { title: '高级搜索', icon: 'search' },
        icon: 'search',
        sort: '42',
      },
      {
        path: 'personal',
        name: 'personal',
        component: () => import('@/views/disk/personal/index'),
        meta: { title: '个人文件', icon: 'dictionary' },
        icon: 'dictionary',
        sort: '43',
      },
      {
        path: 'auth',
        name: 'auth',
        component: () => import('@/views/disk/auth/index'),
        meta: { title: '文件权限', icon: 'permission' },
        icon: 'permission',
        sort: '44',
        children: [
          {
            path: 'person',
            name: 'person',
            component: () => import('@/views/disk/auth/employee/index'),
            meta: { title: '职工权限', icon: 'peoples' },
            icon: 'peoples',
            sort: '45',
          },
          {
            path: 'group',
            name: 'group',
            component: () => import('@/views/disk/auth/group/index'),
            meta: { title: '文件组', icon: 'dept' },
            icon: 'dept',
            sort: '46',
          }
        ],

      }
    ],

  },
  {
    path: '/cert',
    name: 'cert',
    component: () => import('@/layout/Layout'),
    alwaysShow: true,
    meta: { title: '档案中心', icon: 'swagger' },
    icon: 'swagger',
    sort: '5',
    children: [
      {
        path: 'book',
        name: 'book',
        component: () => import('@/views/archives/cert/index'),
        meta: { title: '证书管理', icon: 'log' },
        icon: 'log',
        sort: '51',
      }
    ],
  },
  {
    path: '/approval',
    name: 'approval',
    component: () => import('@/layout/Layout'),
    alwaysShow: true,
    meta: { title: '云表单', icon: 'codeConsole' },
    icon: 'codeConsole',
    sort: '6',
    children: [
      {
        path: 'form',
        name: 'form',
        component: () => import('@/views/approval/formManager/index'),
        meta: { title: '表单管理', icon: 'swagger' },
        icon: 'swagger',
        sort: '61',
      }
    ],
  },
  {
    path: '/projectComment',
    name: 'projectComment',
    component: () => import('@/layout/Layout'),
    alwaysShow: true,
    meta: { title: '项目评价', icon: 'running' },
    icon: 'running',
    sort: '7',
    children: [
      {
        path: 'eform',
        name: 'eform',
        component: () => import('@/views/evaluate/form'),
        meta: { title: '评价表', icon: 'codeConsole' },
        icon: 'codeConsole',
        sort: '71',
      },
      {
        path: 'submitProject',
        name: 'submitProject',
        component: () => import('@/views/submitProject/index'),
        meta: { title: '提交评价', icon: 'add' },
        icon: 'add',
        sort: '72',
      },
      {
        path: 'eproject',
        name: 'eproject',
        component: () => import('@/views/evaluate/index'),
        meta: { title: '评价项目', icon: 'Steve-Jobs' },
        icon: 'Steve-Jobs',
        sort: '73',
      },
      {
        path: 'eset',
        name: 'eset',
        component: () => import('@/views/evaluate/set'),
        meta: { title: '评价设置', icon: 'fwb' },
        icon: 'fwb',
        sort: '74',
      },
      {
        path: 'evaluateProject',
        name: 'evaluateProject',
        component: () => import('@/views/evaluateProject/index'),
        meta: { title: '评审项目', icon: 'icon-excel' },
        icon: 'icon-excel',
        sort: '75',
      }
    ],

  },
]