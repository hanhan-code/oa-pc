<template>
	<div class="navbar">
		<hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container" />
		<breadcrumb class="breadcrumb-container" />
		<div class="right-menu">
			<template v-if="device!=='mobile'">
				<el-tooltip content="全屏" effect="dark" placement="bottom">
					<screenfull class="screenfull right-menu-item" />
				</el-tooltip>
			</template>
			<el-dropdown class="avatar-container right-menu-item" trigger="click">
				<div class="avatar-wrapper">
					<img :src="user.avatar" class="user-avatar" />
					<i class="el-icon-caret-bottom" />
				</div>
				<el-dropdown-menu slot="dropdown">
					<a target="_blank" href="https://docs.auauz.net/">
						<el-dropdown-item>项目文档</el-dropdown-item>
					</a>
					<span style="display:block;" @click="show = true">
						<el-dropdown-item>布局设置</el-dropdown-item>
					</span>
					<router-link to="/user/center">
						<el-dropdown-item>个人中心</el-dropdown-item>
					</router-link>
					<span style="display:block;" @click="toSwitch">
						<el-dropdown-item>切换公司</el-dropdown-item>
					</span>
					<span style="display:block;" @click="open">
						<el-dropdown-item divided>退出登录</el-dropdown-item>
					</span>
				</el-dropdown-menu>
			</el-dropdown>
		</div>
		<div class="index-dome" v-show="showSwitch">
			<p class="index-left" @click="showDome"></p>
			<Switchcompany @change="doSwitchChange"></Switchcompany>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import Switchcompany from '@/components/Switchcompany'

export default {
	components: {
		Breadcrumb,
		Hamburger,
		Screenfull,
		Switchcompany
	},
	data() {
		return {
			dialogVisible: false,
			showSwitch: false //选择公司
		}
	},
	computed: {
		...mapGetters(['sidebar', 'user', 'device']),
		show: {
			get() {
				return this.$store.state.settings.showRightPanel
			},
			set(val) {
				this.$store.dispatch('changeSetting', {
					key: 'showRightPanel',
					value: val
				})
			}
		}
	},
	methods: {
		//切换企业
		toSwitch() {
			this.showSwitch = true
		},
		showDome() {
			this.showSwitch = false
		},
		open() {
			this.$confirm('确定注销并退出系统吗？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.logout()
			})
		},
		toggleSideBar() {
			this.$store.dispatch('ToggleSideBar')
		},

		// 切换成功
		doSwitchChange () {
			this.showSwitch = false
		},
		logout() {
			this.dialogVisible = false
			this.$store.dispatch('LogOut').then(() => {
				location.reload() // 为了重新实例化vue-router对象 避免bug
			})
		}
	}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
	height: 50px;
	line-height: 50px;
	border-radius: 0px !important;
	.hamburger-container {
		line-height: 58px;
		height: 50px;
		float: left;
		padding: 0 10px;
	}
	.breadcrumb-container {
		float: left;
	}
	.errLog-container {
		display: inline-block;
		vertical-align: top;
	}
	.right-menu {
		float: right;
		height: 100%;
		&:focus {
			outline: none;
		}
		.right-menu-item {
			display: inline-block;
			margin: 0 8px;
		}
		.screenfull {
			height: 20px;
		}
		.international {
			vertical-align: top;
		}
		.theme-switch {
			vertical-align: 15px;
		}
		.avatar-container {
			height: 50px;
			margin-right: 30px;
			.avatar-wrapper {
				margin-top: 5px;
				position: relative;
				.user-avatar {
					cursor: pointer;
					width: 40px;
					height: 40px;
					border-radius: 10px;
				}
				.el-icon-caret-bottom {
					cursor: pointer;
					position: absolute;
					right: -20px;
					top: 25px;
					font-size: 12px;
				}
			}
		}
	}
	.icon {
		width: 48px;
		height: 48px;
		background: #1890ff;
		border-radius: 6px 0 0 6px !important;
		text-align: center;
		position: absolute;
		right: 240px;
		top: 250px;
		z-index: 10001;
		i {
			font-size: 24px;
			line-height: 48px;
			color: #fff;
		}
	}
	.index-dome{
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 10000;
		.index-left{
			width: 100%;
			height: 100%;
			margin: 0;
			position: fixed;
			top: 0;
			left: -240px;
			z-index: 10001;
		}
	}
}
</style>
