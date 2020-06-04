<template>
	<el-scrollbar wrap-class="scrollbar-wrapper">
		<el-menu
			:show-timeout="200"
			:default-active="$route.path"
			:collapse="isCollapse"
			:unique-opened="$store.state.settings.uniqueOpened"
			mode="vertical"
			background-color="#304156"
			text-color="#bfcbd9"
			active-text-color="#409EFF"
		>
			<Logo :is-collapse="isCollapse" />
			<sidebar-item v-for="route in list" :key="route.path" :item="route" :base-path="route.path" />
		</el-menu>
	</el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import Logo from './Logo'
export default {
	components: { SidebarItem, Logo },
	data() {
		return {
			list: [
				{
					id: '1',
					appName: '系统管理',
					path: '/system',
					redirect: 'noredirect',
					component: 'Layout',
					alwaysShow: true,
					meta: { title: '系统管理', icon: 'system' },
					label: '系统管理',
					icon: 'system',
					sort: '1',
					createTime: 1545117089000,
					children: [
						{
							id: '2',
							appName: '用户管理',
							path: '/user',
							component: 'system/user/index',
							meta: { title: '用户管理', icon: 'peoples' },
							label: '用户管理',
							icon: 'peoples',
							sort: '2',
							createTime: 1545117284000,
							iframe: 1
						},
						{
							id: '3',
							appName: '角色管理',
							path: 'role',
							component: 'system/role/index',
							meta: { title: '角色管理', icon: 'role' },
							label: '角色管理',
							icon: 'role',
							sort: '3',
							createTime: 1545117367000,
							iframe: 1
						},
						{
							id: '4',
							appName: '权限管理',
							path: 'permission',
							component: 'system/permission/index',
							meta: { title: '权限管理', icon: 'permission' },
							label: '权限管理',
							icon: 'permission',
							sort: '4',
							createTime: 1545117405000,
							iframe: 1
						},
						{
							id: '5',
							appName: '菜单管理',
							path: 'menu',
							component: 'system/menu/index',
							meta: { title: '菜单管理', icon: 'menu' },
							label: '菜单管理',
							icon: 'menu',
							sort: '5',
							createTime: 1545117448000,
							iframe: 1
						},
						{
							id: '35',
							appName: '部门管理',
							path: 'dept',
							component: 'system/dept/index',
							meta: { title: '部门管理', icon: 'dept' },
							label: '部门管理',
							icon: 'dept',
							sort: '6',
							createTime: 1553478360000,
							iframe: 1
						},
						{
							id: '37',
							appName: '岗位管理',
							path: 'job',
							component: 'system/job/index',
							meta: { title: '岗位管理', icon: 'Steve-Jobs' },
							label: '岗位管理',
							icon: 'Steve-Jobs',
							sort: '7',
							createTime: 1553838678000,
							iframe: 1
						},
						{
							id: '39',
							appName: '字典管理',
							path: 'dict',
							component: 'system/dict/index',
							meta: { title: '字典管理', icon: 'dictionary' },
							label: '字典管理',
							icon: 'dictionary',
							sort: '8',
							createTime: 1554868144000,
							iframe: 1
						}
					],
					iframe: 1
				},
				{
					id: '704623089462644736',
					appName: '项目评价',
					path: '//project',
					redirect: 'noredirect',
					component: 'Layout',
					alwaysShow: true,
					meta: { title: '项目评价', icon: 'running' },
					label: '项目评价',
					icon: 'running',
					sort: '999',
					children: [
						{
							id: '704696462054100992',
							appName: '评价表',
							path: 'eform',
							component: 'evaluate/form',
							meta: { title: '评价表', icon: 'codeConsole' },
							label: '评价表',
							icon: 'codeConsole',
							sort: '998',
							iframe: 1
						},
						{
							id: '709800092054687744',
							appName: '提交评价',
							path: 'submitProject',
							component: 'submitProject/index',
							meta: { title: '提交评价', icon: 'add' },
							label: '提交评价',
							icon: 'add',
							sort: '999',
							iframe: 1
						},
						{
							id: '704626084342501376',
							appName: '评价项目',
							path: 'eproject',
							component: 'evaluate/index',
							meta: { title: '评价项目', icon: 'Steve-Jobs' },
							label: '评价项目',
							icon: 'Steve-Jobs',
							sort: '999',
							iframe: 1
						},
						{
							id: '704696670297100288',
							appName: '评价设置',
							path: 'eset',
							component: 'evaluate/set',
							meta: { title: '评价设置', icon: 'fwb' },
							label: '评价设置',
							icon: 'fwb',
							sort: '999',
							iframe: 1
						},
						{
							id: '709798296070492160',
							appName: '评审项目',
							path: 'evaluateProject',
							component: 'evaluateProject/index',
							meta: { title: '评审项目', icon: 'icon-excel' },
							label: '评审项目',
							icon: 'icon-excel',
							sort: '999',
							iframe: 1
						}
					],
					iframe: 1
				},
				{
					id: '6',
					appName: '系统监控',
					path: '/monitor',
					redirect: 'noredirect',
					component: 'Layout',
					alwaysShow: true,
					meta: { title: '系统监控', icon: 'monitor' },
					label: '系统监控',
					icon: 'monitor',
					sort: '2',
					createTime: 1545117468000,
					children: [
						{
							id: '7',
							appName: '操作日志',
							path: 'logs',
							component: 'monitor/log/index',
							meta: { title: '操作日志', icon: 'log' },
							label: '操作日志',
							icon: 'log',
							sort: '11',
							createTime: 1545117506000,
							iframe: 1
						},
						{
							id: '8',
							appName: '系统缓存',
							path: 'redis',
							component: 'monitor/redis/index',
							meta: { title: '系统缓存', icon: 'redis' },
							label: '系统缓存',
							icon: 'redis',
							sort: '13',
							createTime: 1545117541000,
							iframe: 1
						},
						{
							id: '9',
							appName: 'SQL监控',
							path: 'druid',
							component: 'monitor/sql/index',
							meta: { title: 'SQL监控', icon: 'sqlMonitor' },
							label: 'SQL监控',
							icon: 'sqlMonitor',
							sort: '14',
							createTime: 1545117574000,
							iframe: 1
						},
						{
							id: '32',
							appName: '异常日志',
							path: 'errorLog',
							component: 'monitor/log/errorLog',
							meta: { title: '异常日志', icon: 'error' },
							label: '异常日志',
							icon: 'error',
							sort: '12',
							createTime: 1547358543000,
							iframe: 1
						}
					],
					iframe: 1
				},
				{
					id: '10',
					appName: '组件管理',
					path: '/components',
					redirect: 'noredirect',
					component: 'Layout',
					alwaysShow: true,
					meta: { title: '组件管理', icon: 'zujian' },
					label: '组件管理',
					icon: 'zujian',
					sort: '3',
					createTime: 1545197896000,
					children: [
						{
							id: '11',
							appName: '图标库',
							path: 'icon',
							component: 'components/IconSelect',
							meta: { title: '图标库', icon: 'icon' },
							label: '图标库',
							icon: 'icon',
							sort: '51',
							createTime: 1545197929000,
							iframe: 1
						}
					],
					iframe: 1
				},
				{
					id: '709799888052129792',
					appName: '提交评价',
					path: '/submit',
					redirect: 'noredirect',
					component: 'Layout',
					alwaysShow: true,
					meta: { title: '提交评价', icon: 'add' },
					label: '提交评价',
					icon: 'add',
					sort: '8',
					iframe: 1
				},
				{
					id: '36',
					appName: '系统工具',
					path: '/sys-tools',
					redirect: 'noredirect',
					component: 'Layout',
					alwaysShow: true,
					meta: { title: '系统工具', icon: 'sys-tools' },
					label: '系统工具',
					icon: 'sys-tools',
					sort: '5',
					createTime: 1553828255000,
					children: [
						{
							id: '14',
							appName: '邮件工具',
							path: 'email',
							component: 'tools/email/index',
							meta: { title: '邮件工具', icon: 'email' },
							label: '邮件工具',
							icon: 'email',
							sort: '24',
							createTime: 1545876789000,
							iframe: 1
						},
						{
							id: '16',
							appName: '图床管理',
							path: 'pictures',
							component: 'tools/picture/index',
							meta: { title: '图床管理', icon: 'image' },
							label: '图床管理',
							icon: 'image',
							sort: '25',
							createTime: 1545961013000,
							iframe: 1
						},
						{
							id: '18',
							appName: '七牛云存储',
							path: 'qiniu',
							component: 'tools/qiniu/index',
							meta: { title: '七牛云存储', icon: 'qiniu' },
							label: '七牛云存储',
							icon: 'qiniu',
							sort: '26',
							createTime: 1546225935000,
							iframe: 1
						},
						{
							id: '19',
							appName: '支付宝工具',
							path: 'aliPay',
							component: 'tools/aliPay/index',
							meta: { title: '支付宝工具', icon: 'alipay' },
							label: '支付宝工具',
							icon: 'alipay',
							sort: '27',
							createTime: 1546239158000,
							iframe: 1
						},
						{
							id: '28',
							appName: '定时任务',
							path: 'timing',
							component: 'system/timing/index',
							meta: { title: '定时任务', icon: 'timing' },
							label: '定时任务',
							icon: 'timing',
							sort: '21',
							createTime: 1546864480000,
							iframe: 1
						},
						{
							id: '30',
							appName: '代码生成',
							path: 'generator',
							component: 'generator/index',
							meta: { title: '代码生成', icon: 'dev' },
							label: '代码生成',
							icon: 'dev',
							sort: '22',
							createTime: 1547192755000,
							iframe: 1
						},
						{
							id: '38',
							appName: '接口文档',
							path: 'swagger2',
							component: 'tools/swagger/index',
							meta: { title: '接口文档', icon: 'swagger' },
							label: '接口文档',
							icon: 'swagger',
							sort: '23',
							createTime: 1553860673000,
							iframe: 1
						}
					],
					iframe: 1
				},
				{
					id: '44',
					appName: '考勤管理',
					path: '/attendance',
					redirect: 'noredirect',
					component: 'Layout',
					alwaysShow: true,
					meta: { title: '考勤管理', icon: 'peoples' },
					label: '考勤管理',
					icon: 'peoples',
					sort: '11',
					createTime: 1569047813000,
					children: [
						{
							id: '45',
							appName: '考勤统计',
							path: '/statistics',
							component: 'attendance/statistics/index',
							meta: { title: '考勤统计', icon: 'peoples' },
							label: '考勤统计',
							icon: 'peoples',
							sort: '999',
							createTime: 1569048046000,
							children: [
								{
									id: '46',
									appName: '/月度汇总',
									path: 'summary',
									component: 'attendance/statistics/summary',
									meta: { title: '月度汇总', icon: 'peoples' },
									label: '月度汇总',
									icon: 'peoples',
									sort: '3',
									createTime: 1569048110000,
									iframe: 1
								},
								{
									id: '47',
									appName: '打卡时间',
									path: 'date',
									component: 'attendance/statistics/date/index',
									meta: { title: '打卡时间', icon: 'peoples' },
									label: '打卡时间',
									icon: 'peoples',
									sort: '2',
									createTime: 1569048146000,
									iframe: 1
								},
								{
									id: '48',
									appName: '考勤记录',
									path: 'card',
									component: 'attendance/statistics/card/index',
									meta: { title: '考勤记录', icon: 'peoples' },
									label: '考勤记录',
									icon: 'peoples',
									sort: '1',
									createTime: 1569048170000,
									iframe: 1
								}
							],
							iframe: 1
						}
					],
					iframe: 1
				},
				{
					id: '53',
					appName: '员工管理',
					path: '/employee',
					redirect: 'noredirect',
					component: 'Layout',
					alwaysShow: true,
					meta: { title: '员工管理', icon: 'user' },
					label: '员工管理',
					icon: 'user',
					sort: '12',
					createTime: 1570542642000,
					children: [
						{
							id: '54',
							appName: '基本信息',
							path: 'employee',
							component: 'employee/base/index',
							meta: { title: '基本信息', icon: 'index' },
							label: '基本信息',
							icon: 'index',
							sort: '1',
							createTime: 1570543143000,
							iframe: 1
						},
						{
							id: '55',
							appName: '详细信息',
							path: 'detail',
							component: 'employee/detail/index',
							meta: { title: '详细信息', icon: 'user1' },
							label: '详细信息',
							icon: 'user1',
							sort: '999',
							createTime: 1570543220000,
							iframe: 1
						}
					],
					iframe: 1
				},
				{
					id: '678920595248091136',
					appName: '云盘中心',
					path: '/dist',
					redirect: 'noredirect',
					component: 'Layout',
					alwaysShow: true,
					meta: { title: '云盘中心', icon: 'dictionary' },
					label: '云盘中心',
					icon: 'dictionary',
					sort: '14',
					children: [
						{
							id: '678921264944222208',
							appName: '公司文件',
							path: 'company',
							component: 'disk/company/index',
							meta: { title: '公司文件', icon: 'dictionary' },
							label: '公司文件',
							icon: 'dictionary',
							sort: '6',
							iframe: 1
						},
						{
							id: '680562974082306048',
							appName: '高级搜索',
							path: 'search',
							component: 'disk/search/index',
							meta: { title: '高级搜索', icon: 'search' },
							label: '高级搜索',
							icon: 'search',
							sort: '7',
							iframe: 1
						},
						{
							id: '678921405105278976',
							appName: '个人文件',
							path: 'personal',
							component: 'disk/personal/index',
							meta: { title: '个人文件', icon: 'dictionary' },
							label: '个人文件',
							icon: 'dictionary',
							sort: '8',
							iframe: 1
						},
						{
							id: '678921957369286656',
							appName: '文件权限',
							path: 'auth',
							component: 'disk/auth/index',
							meta: { title: '文件权限', icon: 'permission' },
							label: '文件权限',
							icon: 'permission',
							sort: '4',
							children: [
								{
									id: '678922346609086464',
									appName: '职工权限',
									path: 'employee',
									component: 'disk/auth/employee/index',
									meta: { title: '职工权限', icon: 'peoples' },
									label: '职工权限',
									icon: 'peoples',
									sort: '2',
									iframe: 1
								},
								{
									id: '678922225515335680',
									appName: '文件组',
									path: 'group',
									component: 'disk/auth/group/index',
									meta: { title: '文件组', icon: 'dept' },
									label: '文件组',
									icon: 'dept',
									sort: '1',
									iframe: 1
								}
							],
							iframe: 1
						}
					],
					iframe: 1
				},
				{
					id: '56',
					appName: '档案中心',
					path: '/archives',
					redirect: 'noredirect',
					component: 'Layout',
					alwaysShow: true,
					meta: { title: '档案中心', icon: 'swagger' },
					label: '档案中心',
					icon: 'swagger',
					sort: '13',
					createTime: 1578293464000,
					children: [
						{
							id: '663760979463868416',
							appName: '证书管理',
							path: 'cert',
							component: 'archives/cert/index',
							meta: { title: '证书管理', icon: 'log' },
							label: '证书管理',
							icon: 'log',
							sort: '1',
							iframe: 1
						}
					],
					iframe: 1
				},
				{
					id: '709797790245818368',
					appName: '评审项目',
					path: '/evaluate',
					redirect: 'noredirect',
					component: 'Layout',
					alwaysShow: true,
					meta: { title: '评审项目', icon: 'permission' },
					label: '评审项目',
					icon: 'permission',
					sort: '7',
					iframe: 1
				}
			]
		}
	},
	computed: {
		...mapGetters(['roles', 'sidebar']),
		isCollapse() {
			return !this.sidebar.opened
		}
	}
}
</script>
