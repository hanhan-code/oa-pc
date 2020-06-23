<template>
	<div class="index">
		<ul>
			<h1>选择公司</h1>
			<li v-for="(item,id) in showList" :key="id" @click="toCompany(item)">{{item.name}}</li>
		</ul>
	</div>
</template>
<script>
import { encrypt } from '@/utils/rsaEncrypt'
import Config from '@/config'
import Cookies from 'js-cookie'
import {
	sendVerificationCode,
	codeIN,
	login,
	myCompany,
	toSwitch,
	toWeb
} from '@/api/login'
import { mapGetters, mapActions } from 'vuex'
import {
	getToken,
	setToken,
	setLoginInfo,
	getUserId,
	getPhone,
	getPassword
} from '@/utils/auth'
export default {
	data() {
		return {
			showList: '',
		}
	},
	computed: {
		...mapGetters(['user'])
	},
	mounted() {
		let min = {
			pageNum: 1,
			pageSize: 10,
			userId: getUserId(),
			keyword: '' //查询关键词
		}
		myCompany(min).then(res => {
			this.showList = res.data.records
		})
	},
	methods: {
		...mapActions(['delAllViews']),
		toCompany(item) {
			let id = item.id
			this.$emit('change')
			this.delAllViews()
			this.$store.dispatch('toSwitch', id).then(res => {
				this.$router.push('/')
			})
		}
	}
}
</script>
<style  rel="stylesheet/scss" lang="scss" scoped>
.index {
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	position: fixed;
	z-index: 10000;
	top: 0;
	left: 0;
	ul {
		width: 240px;
		background: #fff;
		float: right;
		height: 100%;
		margin: 0;
		padding-right: 20px;
		h1 {
			font-size: 22px;
			line-height: 40px;
			text-align: center;
		}
		li {
			list-style: none;
			font-size: 20px;
			line-height: 40px;
			padding-left: 20px;
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
		i {
			font-size: 24px;
			line-height: 48px;
			color: #fff;
		}
	}
}
</style>