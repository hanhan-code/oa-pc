<template>
	<div class="index">
		<ul>
			<h1>选择公司</h1>
			<li v-for="(item,id) in showList" :key="id" @click="toswich">{{item.name}}</li>
		</ul>
	</div>
</template>
<script>
import { getEmployeeId, getCompanyId, getToken, getUserId } from '@/utils/auth'
import { myCompany } from '@/api/login'
export default {
	data() {
		return {
			showList: ''
		}
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
      console.log(this.showList)
    })
  },
  methods:{
    toswich(){}
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