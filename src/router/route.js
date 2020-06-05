export default  [
  {
    path: '/system',
    name: 'system',
    redirect: 'user',
    component: () => import('@/layout/Layout'),
    meta: { title: '系统管理', icon: 'system' },
    icon: 'system',
    sort: '1',
    children: [
      {
        path: 'user',
        component: () => import('@/views/system/user/index'),
        meta: { title: '用户管理', icon: 'peoples' },
        icon: 'peoples',
        sort: '2',
        
        
      },
      {
        id: '3',
        path: 'role',
        component: () => import('@/views/system/role/index'),
        meta: { title: '角色管理', icon: 'role' },
        icon: 'role',
        sort: '3',
      },
      {
        id: '4',
        path: 'permission',
        component: () => import('@/views/system/permission/index'),
        meta: { title: '权限管理', icon: 'permission' },
        icon: 'permission',
        sort: '4',
      },
      {
        id: '5',
        path: 'menu',
        component: () => import('@/views/system/menu/index'),
        meta: { title: '菜单管理', icon: 'menu' },
        icon: 'menu',
        sort: '5',
      },
      {
        id: '35',
        path: 'dept',
        component: () => import('@/views/system/dept/index'),
        meta: { title: '部门管理', icon: 'dept' },
        icon: 'dept',
        sort: '6',
      },
      {
        id: '37',
        path: 'job',
        component: () => import('@/views/system/job/index'),
        meta: { title: '岗位管理', icon: 'Steve-Jobs' },
        icon: 'Steve-Jobs',
        sort: '7',
      },
      {
        id: '39',
        path: 'dict',
        component: () => import('@/views/system/dict/index'),
        meta: { title: '字典管理', icon: 'dictionary' },
        icon: 'dictionary',
        sort: '8',
      }
    ],
    
  },
  {
    path: '/project',
    name: 'project',
    
    component: () => import('@/layout/Layout'),
    alwaysShow: true,
    meta: { title: '项目评价', icon: 'running' },
    icon: 'running',
    sort: '999',
    children: [
      {
        path: 'eform',
        component: () => import('@/views/evaluate/form'),
        meta: { title: '评价表', icon: 'codeConsole' },
        icon: 'codeConsole',
        sort: '998',
      },
      {
        path: 'submitProject',
        component: () => import('@/views/submitProject/index'),
        meta: { title: '提交评价', icon: 'add' },
        icon: 'add',
        sort: '999',
      },
      {
        path: 'eproject',
        component: () => import('@/views/evaluate/index'),
        meta: { title: '评价项目', icon: 'Steve-Jobs' },
        icon: 'Steve-Jobs',
        sort: '999',
      },
      {
        path: 'eset',
        component: () => import('@/views/evaluate/set'),
        meta: { title: '评价设置', icon: 'fwb' },
        icon: 'fwb',
        sort: '999',
      },
      {
        path: 'evaluateProject',
        component: () => import('@/views/evaluateProject/index'),
        meta: { title: '评审项目', icon: 'icon-excel' },
        icon: 'icon-excel',
        sort: '999',
      }
    ],
    
  },
  {
    path: '/monitor',
    name: 'monitor',
    
    component: () => import('@/layout/Layout'),
    alwaysShow: true,
    meta: { title: '系统监控', icon: 'monitor' },
    icon: 'monitor',
    sort: '2',
    children: [
      {
        path: 'logs',
        component: () => import('@/views/monitor/log/index'),
        meta: { title: '操作日志', icon: 'log' },
        icon: 'log',
        sort: '11',
      },
      {
        path: 'redis',
        component: () => import('@/views/monitor/redis/index'),
        meta: { title: '系统缓存', icon: 'redis' },
        icon: 'redis',
        sort: '13',
      },
      {
        path: 'druid',
        component: () => import('@/views/monitor/sql/index'),
        meta: { title: 'SQL监控', icon: 'sqlMonitor' },
        icon: 'sqlMonitor',
        sort: '14',
      },
      {
        path: 'errorLog',
        component: () => import('@/views/monitor/log/errorLog'),
        meta: { title: '异常日志', icon: 'error' },
        icon: 'error',
        sort: '12',
      }
    ],
    
  },
  {
    path: '/components',
    name: 'components',
    
    component: () => import('@/layout/Layout'),
    alwaysShow: true,
    meta: { title: '组件管理', icon: 'zujian' },
    icon: 'zujian',
    sort: '3',
    children: [
      {
        path: 'icon',
        component: () => import('@/views/components/IconSelect'),
        meta: { title: '图标库', icon: 'icon' },
        icon: 'icon',
        sort: '51',
      }
    ],
    
  },
  {
    path: '/submitProject',
    name: 'submitProject',
    component: () => import('@/layout/Layout'),
    alwaysShow: true,
    meta: { title: '提交评价', icon: 'add' },
    icon: 'add',
    sort: '8',
  },
  {
    path: '/sys-tools',
    name: 'sys-tools',
    component: () => import('@/layout/Layout'),
    alwaysShow: true,
    meta: { title: '系统工具', icon: 'sys-tools' },
    icon: 'sys-tools',
    sort: '5',
    children: [
      {
        path: 'email',
        component: () => import('@/views/tools/email/index'),
        meta: { title: '邮件工具', icon: 'email' },
        icon: 'email',
        sort: '24',
      },
      {
        path: 'pictures',
        component: () => import('@/views/tools/picture/index'),
        meta: { title: '图床管理', icon: 'image' },
        icon: 'image',
        sort: '25',
      },
      {
        path: 'qiniu',
        component: () => import('@/views/tools/qiniu/index'),
        meta: { title: '七牛云存储', icon: 'qiniu' },
        icon: 'qiniu',
        sort: '26',
      },
      {
        path: 'aliPay',
        component: () => import('@/views/tools/aliPay/index'),
        meta: { title: '支付宝工具', icon: 'alipay' },
        icon: 'alipay',
        sort: '27',
      },
      {
        path: 'timing',
        component: () => import('@/views/system/timing/index'),
        meta: { title: '定时任务', icon: 'timing' },
        icon: 'timing',
        sort: '21',
      },
      {
        path: 'generator',
        component: () => import('@/views/generator/index'),
        meta: { title: '代码生成', icon: 'dev' },
        icon: 'dev',
        sort: '22',
      },
      {
        path: 'swagger2',
        component: () => import('@/views/tools/swagger/index'),
        meta: { title: '接口文档', icon: 'swagger' },
        icon: 'swagger',
        sort: '23',
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
    sort: '11',
    children: [
      {
        path: '/statistics',
        component: () => import('@/views/attendance/statistics/index'),
        meta: { title: '考勤统计', icon: 'peoples' },
        icon: 'peoples',
        sort: '999',
        children: [
          {
            path: 'summary',
            component: () => import('@/views/attendance/statistics/summary'),
            meta: { title: '月度汇总', icon: 'peoples' },
            icon: 'peoples',
            sort: '3',
          },
          {
            path: 'date',
            component: () => import('@/views/attendance/statistics/date/index'),
            meta: { title: '打卡时间', icon: 'peoples' },
            icon: 'peoples',
            sort: '2',
          },
          {
            path: 'card',
            component: () => import('@/views/attendance/statistics/card/index'),
            meta: { title: '考勤记录', icon: 'peoples' },
            icon: 'peoples',
            sort: '1',
          }
        ],
      }
    ],
  },
  {
    path: '/employee',
    name: 'employee',
    redirect: 'employee',
    component: () => import('@/layout/Layout'),
    meta: { title: '员工管理', icon: 'user' },
    icon: 'user',
    sort: '12',
    children: [
      {
        path: 'employee',
        component: () => import('@/views/employee/base/index'),
        meta: { title: '基本信息', icon: 'index' },
        icon: 'index',
        sort: '1',
      },
      {
        path: 'detail',
        component: () => import('@/views/employee/detail/index'),
        meta: { title: '详细信息', icon: 'user1' },
        icon: 'user1',
        sort: '999',
      }
    ],
  },
  {
    path: '/dist',
    name: 'dist',
    
    component: () => import('@/layout/Layout'),
    alwaysShow: true,
    meta: { title: '云盘中心', icon: 'dictionary' },
    icon: 'dictionary',
    sort: '14',
    children: [
      {
        path: 'company',
        component: () => import('@/views/disk/company/index'),
        meta: { title: '公司文件', icon: 'dictionary' },
        icon: 'dictionary',
        sort: '6',
      },
      {
        path: 'search',
        component: () => import('@/views/disk/search/index'),
        meta: { title: '高级搜索', icon: 'search' },
        icon: 'search',
        sort: '7',
      },
      {
        path: 'personal',
        component: () => import('@/views/disk/personal/index'),
        meta: { title: '个人文件', icon: 'dictionary' },
        icon: 'dictionary',
        sort: '8',
      },
      {
        path: 'auth',
        component: () => import('@/views/disk/auth/index'),
        meta: { title: '文件权限', icon: 'permission' },
        icon: 'permission',
        sort: '4',
        children: [
          {
            path: 'employee',
            component: () => import('@/views/disk/auth/employee/index'),
            meta: { title: '职工权限', icon: 'peoples' },
            icon: 'peoples',
            sort: '2',
          },
          {
            path: 'group',
            component: () => import('@/views/disk/auth/group/index'),
            meta: { title: '文件组', icon: 'dept' },
            icon: 'dept',
            sort: '1',
          }
        ],
        
      }
    ],
    
  },
  {
    path: '/archives',
    name: 'archives',
    
    component: () => import('@/layout/Layout'),
    alwaysShow: true,
    meta: { title: '档案中心', icon: 'swagger' },
    icon: 'swagger',
    sort: '13',
    children: [
      {
        path: 'cert',
        component: () => import('@/views/archives/cert/index'),
        meta: { title: '证书管理', icon: 'log' },
        icon: 'log',
        sort: '1',
      }
    ],
    
  },
  {
    path: '/evaluate',
    name: 'evaluate',
    
    component: () => import('@/layout/Layout'),
    alwaysShow: true,
    meta: { title: '评审项目', icon: 'permission' },
    icon: 'permission',
    sort: '7',
    
  }
]