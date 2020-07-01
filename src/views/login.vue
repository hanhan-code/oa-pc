<template>
	<div class="login">
		<el-container>
			<el-header>
				<p class="logo">工程全过程管理系统</p>
				<!-- <el-button @click="companyRegistration" disabled>注册新企业</el-button> -->
			</el-header>
			<el-main>
				<div class="login-left" v-show="loginLeft">
					不只是管理软件
					<br />更是高效的智慧办公新体验
				</div>
				<div class="login-right" v-show="loginRight">
					<el-form ref="loginForm" :model="loginForm">
						<h3>账号密码登录</h3>
						<el-form-item prop="phone">
							<el-input v-model="loginForm.phone" type="text" auto-complete="off" placeholder="账号"></el-input>
						</el-form-item>
						<el-form-item prop="password">
							<el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码"></el-input>
						</el-form-item>
						<el-form-item style="width:100%;height: 30px;">
							<el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住我</el-checkbox>
							<!-- <el-button type="text" class="forget-password" @click="showPassword" disabled>忘记密码</el-button> -->
						</el-form-item>
						<el-form-item style="width:100%;">
							<el-button
								:loading="loading"
								size="medium"
								type="primary"
								style="width:100%;"
								@click.native.prevent="handleLogin"
							>
								<span v-if="!loading">登 录</span>
								<span v-else>登 录 中...</span>
							</el-button>
						</el-form-item>
					</el-form>
					<div class="other-botton">
						<!-- <el-button type="text" @click="showScancode" disabled>扫码登录</el-button> -->
						<el-button type="text" @click="showPhone" style="width: 100%;">手机号码登录</el-button>
					</div>
				</div>
				<div class="switch-company" v-show="switchCompany">
					<h3 class="title">请选择要登陆的账号</h3>
					<div class="index-body">
						<ul class="infinite-list" style="overflow:auto">
							<li v-for="(item,id) in companyMine" :key="id">
								<img src="@/assets/common/company.png" />
								<p>
									<span class="companyName">{{item.name}}</span>
									<span class="toCompany" @click="toCompany(item)">点击进入 ></span>
								</p>
							</li>
						</ul>
					</div>
					<!-- <button>关闭</button> -->
				</div>
				<div class="login-phone" v-show="loginPhone">
					<el-form
						ref="phoneForm"
						:model="phoneForm"
						label-position="left"
						label-width="0px"
						:rules="rules"
					>
						<h3>手机号码登录</h3>
						<el-form-item prop="phone">
							<el-input
								placeholder="请输入手机号码"
								v-model="phoneForm.phone"
								type="phone"
								onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
								maxlength="11"
							></el-input>
						</el-form-item>
						<el-form-item prop="code">
							<el-input
								placeholder="请输入手机验证码"
								onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
								v-model="phoneForm.code"
								type="text"
								style="width: 60%;"
								maxlength="6"
							></el-input>
							<el-button
								type="text"
								class="Verification"
								:class="{disabled: !this.canClick}"
								@click="sendVerificationCode(phoneForm.phone)"
								style="width: 34%;"
							>{{contentCode}}</el-button>
						</el-form-item>
						<!-- <el-form-item style="width:100%;height: 30px;">

						</el-form-item>-->
						<el-form-item style="width:100%;">
							<!-- <el-button @click="code(phoneForm)" type="primary" style="width:100%;">登录</el-button> -->
							<el-button
								:loading="loading"
								size="medium"
								type="primary"
								style="width:100%;"
								@click.native.prevent="handleCode"
							>
								<span v-if="!loading">登 录</span>
								<span v-else>登 录 中...</span>
							</el-button>
						</el-form-item>
					</el-form>
					<div class="other-botton">
						<!-- <el-button type="text" @click="showScancode" disabled>扫码登录</el-button> -->
						<el-button type="text" @click="showLogin" style="width: 100%;">账号密码登录</el-button>
					</div>
				</div>
				<div class="forgetPassword" v-show="showForget">
					<el-form label-position="left" label-width="0px">
						<h3>忘记密码</h3>
						<el-form-item>
							<el-input placeholder="请输入手机号码" v-model="input" clearable type="phone"></el-input>
						</el-form-item>
						<el-form-item style="width: 100%;">
							<el-input placeholder="请输入验证码" v-model="input" clearable type="input" style="width: 59%;"></el-input>
							<el-button type="text" style="width: 30%; margin-left: 9%;">获取验证码</el-button>
						</el-form-item>
						<el-form-item>
							<el-input placeholder="请输入新密码" v-model="input" clearable type="password"></el-input>
						</el-form-item>
						<el-form-item>
							<el-input placeholder="请再一次输入" v-model="input" clearable type="password"></el-input>
						</el-form-item>
						<el-form-item style="width:100%;">
							<el-button type="primary" style="width:30%;">注册</el-button>
							<el-button type="info" plain style="width:30%;" @click="showReturn">返回</el-button>
						</el-form-item>
					</el-form>
				</div>
				<div class="scan-code" v-show="showScan">
					<el-form label-position="left" label-width="0px">
						<h3>
							扫码登录
							<span>同时支持企业微信和微信扫码</span>
						</h3>
						<el-form-item>
							<dl v-show="showScsnbody">
								<dt>二维码已失效</dt>
								<dd>
									<el-button type="primary" @click="showScanloading">请点击刷新</el-button>
								</dd>
							</dl>
							<p v-loading="scanLoading"></p>
							<img src="../assets/logo/login.png" alt="二维码" />
						</el-form-item>
						<el-form-item>
							<el-checkbox>5天内自动登录</el-checkbox>
						</el-form-item>
					</el-form>
					<div class="scan-button">
						<el-button @click="showLogin" type="text" style="width:30%;">账号密码登录</el-button>
						<el-button type="text" style="width:30%;" @click="showPhone">手机号码登录</el-button>
					</div>
				</div>
				<div class="company" v-show="showCompany">
					<el-form label-position="left" label-width="0px">
						<h3>公司注册</h3>
						<el-form-item>
							<el-input placeholder="请输入手机号码" v-model="input" clearable type="phone"></el-input>
						</el-form-item>
						<el-form-item>
							<el-input placeholder="请输入公司名称" v-model="input" clearable type="text"></el-input>
						</el-form-item>
						<el-form-item style="width: 100%;">
							<el-input placeholder="请输入验证码" v-model="input" clearable type="input" style="width: 59%;"></el-input>
							<el-button type="text" style="width: 30%; margin-left: 9%;">获取验证码</el-button>
						</el-form-item>
						<el-form-item style="width:100%;">
							<el-button type="primary" style="width:30%;">注册</el-button>
							<el-button type="info" plain style="width:30%;" @click="showReturn">返回</el-button>
						</el-form-item>
					</el-form>
				</div>
			</el-main>
			<el-footer>
				<ul>
					<li>关于我们</li>
					<el-divider direction="vertical"></el-divider>
					<li>用户协议</li>
					<el-divider direction="vertical"></el-divider>
					<li>帮助中心</li>
					<el-divider direction="vertical"></el-divider>
					<li>用户手册</li>
					<el-divider direction="vertical"></el-divider>
					<li>
						<a href="http://beian.miit.gov.cn/" target="_blank">{{ $store.state.settings.caseNumber }}</a>
					</li>
				</ul>
			</el-footer>
		</el-container>
	</div>
</template>

<script>
import { encrypt } from '@/utils/rsaEncrypt'
import Config from '@/config'
import Cookies from 'js-cookie'
import axios from 'axios'
import {
	sendVerificationCode,
	codeIN,
	login,
	myCompany,
	toSwitch
} from '@/api/login'
import { getToken, setToken, setLoginInfo } from '@/utils/auth'

export default {
	name: 'Login',
	data() {
		var checkPhone = (rule, value, callback) => {
			if (!value) {
				return callback(new Error('手机号不能为空'))
			} else {
				const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
				if (reg.test(value)) {
					callback()
				} else {
					return callback(new Error('请输入正确的手机号'))
				}
			}
		}
		return {
			input: '',
			cookiePass: '',
			name: '',
			loginForm: {
				code: '',
				password: '',
				phone: '',
				uuid: '',
				rememberMe: false
			},
			loginRules: {
				phone: [
					{
						required: true,
						trigger: 'blur',
						message: '用户名不能为空'
					}
				],
				password: [
					{
						required: true,
						trigger: 'blur',
						message: '密码不能为空'
					}
				]
			},
			// companyId:"",
			contentCode: '获取验证码',
			totalTime: 30,
			canClick: true,
			showForget: false,
			verificationCode: {
				bizType: 1,
				companyId: 1001,
				phoneNum: '',
				templateType: 5
			},
			phoneForm: {
				code: '',
				password: '',
				phone: ''
			},
			loginLeft: true, //左侧文案
			loginRight: true, //登录
			switchCompany: false, //选择公司弹窗
			companyMine: '', //我的公司列表
			showCompany: false,
			loginPhone: false,
			loading: false,
			showScan: false,
			showScsnbody: true,
			scanLoading: false,
			// redirect: undefined,
			paths: undefined,
			rules: {
				phone: [
					{
						required: true,
						message: '请输入手机号码',
						trigger: 'blur'
					},
					{
						min: 11,
						max: 11,
						message: '长度在 11 到 11 个字符',
						trigger: 'blur'
					},
					{ validator: checkPhone, trigger: 'blur' }
				],
				code: [
					{
						required: true,
						message: '请输入手机验证码',
						trigger: 'blur'
					},
					{
						min: 1,
						max: 6,
						message: '验证码格式错误',
						trigger: 'blur'
					}
				]
			},
			tokener: ''
		}
	},
	watch: {
		$route: {
			handler: function(route) {
				// this.redirect = route.query && route.query.redirect
			},
			immediate: true
		}
	},
	created() {
		// this.getCookie()
	},
	methods: {
		//登录
		handleLogin() {
			let user = {
				phone: this.loginForm.phone,
				password: this.loginForm.password,
				rememberMe: this.loginForm.rememberMe
			}
			login(user).then(res => {
				if (res.code === 0) {
					let data = res.data
					let token = data.token
					this.tokener = token
					let userId = data.userId
					axios
						.get(
							this.$network +
								`user/company/mine?pageNum=1&pageSize=100&userId=${userId}&keyword=`,
							{
								headers: {
									Authorization: 'Bearer ' + token
								}
							}
						)
						.then(row => {
							if (row.data.code === 0) {
								this.loginRight = false //登录
								this.switchCompany = true //选择公司
								this.companyMine = row.data.data.records
							}
						})
				}
			})
		},
		// 点击公司获取应用
		toCompany(item) {
			let id = item.id
			setToken(this.tokener)
			this.$refs.loginForm.validate(valid => {
				this.$store.dispatch('toSwitch', id).then(res => {
					// console.log(res)
					this.$router.push('/')
				})
			})
		},

		//注册公司
		companyRegistration() {
			;(this.showCompany = true),
				(this.loginRight = false),
				(this.loginPhone = false),
				(this.showScan = false),
				(this.loginLeft = false)
		},
		//手机号登录
		showPhone() {
			;(this.showCompany = false),
				(this.loginRight = false),
				(this.loginPhone = true),
				(this.showScan = false),
				(this.loginLeft = true)
		},
		//扫码登录
		showScancode() {
			;(this.showCompany = false),
				(this.loginPhone = false),
				(this.loginRight = false),
				(this.showScan = true),
				(this.loginLeft = true)
		},
		//账号密码登录
		showLogin() {
			;(this.showCompany = false),
				(this.loginPhone = false),
				(this.loginRight = true),
				(this.showScan = false),
				(this.loginLeft = true)
		},
		//忘记密码
		showPassword() {
			;(this.showCompany = false),
				(this.loginPhone = false),
				(this.loginRight = false),
				(this.showForget = true),
				(this.loginLeft = false)
		},
		//返回
		showReturn() {
			;(this.showCompany = false),
				(this.loginPhone = false),
				(this.loginRight = true),
				(this.showForget = false),
				(this.loginLeft = true)
		},
		//刷新二维码
		showScanloading() {
			;(this.scanLoading = true), (this.showScsnbody = false)
		},
		//发送验证码
		sendVerificationCode(phoneForm) {
			this.verificationCode.phoneNum = phoneForm
			if (!this.canClick) return //改动的是这两行代码
			this.canClick = false
			this.contentCode = this.totalTime + '秒后重新发送'
			let clock = window.setInterval(() => {
				this.totalTime--
				this.contentCode = this.totalTime + '秒后重新发送'
				if (this.totalTime < 0) {
					window.clearInterval(clock)
					this.contentCode = '重新发送验证码'
					this.totalTime = 30
					this.canClick = true //这里重新开启
				}
			}, 1000)
			// const phoneUser = {
			// 	bizType: this.verificationCode.bizType,
			// 	companyId: this.verificationCode.companyId,
			// 	phoneNum: this.verificationCode.phoneNum,
			// 	templateType: this.verificationCode.templateType
			// }
			// let phoneData = phoneUser
			let phoneData = {
				phone: phoneForm, //手机号码
				templateType: 5 //2:忘记密码 3: 用户注册 5: 用户登录 7: 公司注册
			}
			sendVerificationCode(phoneData).then(res => {
				// if (res.code == 0) {
				//   alert("获取验证码成功")
				// } else {
				//   alert(res.mas)
				// }
			})
		},
		//验证码登录
		handleCode() {
			let self = this
			this.$refs.phoneForm.validate(res => {
				const phoneLogin = {
					phone: this.phoneForm.phone,
					code: this.phoneForm.code
				}
				if (res) {
					this.loading = true
					// this.$store.dispatch('CodeIN', phoneLogin).then(res => {
					codeIN(phoneLogin)
						.then(res => {
							this.loading = false
							if (res.code === 0) {
								let data = res.data
								let token = data.token
								this.tokener = token
								let userId = data.userId
								axios
									.get(
										this.$network +
											`user/company/mine?pageNum=1&pageSize=100&userId=${userId}&keyword=`,
										{
											headers: {
												Authorization: 'Bearer ' + token
											}
										}
									)
									.then(row => {
										if (row.data.code === 0) {
											this.loginRight = false //登录
											this.switchCompany = true //选择公司
											this.companyMine = row.data.data.records
										}
									})
							}
						})
						.catch(() => {
							console.log('catch')
						})
				} else {
					console.log('error submit!!')
					return false
				}
			})
		}
	}
}
</script>

<style rel="stylesheet/scss" lang="scss">
* {
	margin: 0;
	padding: 0;
	list-style: none;
}

.login {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	background: url(../assets/logo/bj.png) 50% 0 no-repeat;
	background-size: 100% 100%;

	.el-container {
		width: 100%;
		height: 100%;

		.el-header {
			width: 100%;
			height: 60px !important;
			background: #fff;
			line-height: 60px;

			.logo {
				font-size: 32px;
				color: #6e7683;
				float: left;
				margin-left: 12%;
			}

			.el-button {
				border: 1px solid #5596ff;
				padding: 10px 20px;
				font-size: 18px;
				color: #5596ff;
				float: right;
				margin-top: 24px;
				margin-right: 12%;
			}
		}

		.el-main {
			position: relative;

			.login-left {
				position: absolute;
				top: 40%;
				left: 12.5%;
				font-size: 48px;
				line-height: 80px;
				color: #fff;
				font-family: '宋体';
			}

			.login-right,
			.login-phone {
				position: absolute;
				top: 50%;
				z-index: 99;
				right: 12%;
				margin-top: -200px;
				width: 406px;
				height: 440px;
				background: #fff;
				border-radius: 12px;
				overflow: hidden;

				.el-form {
					padding: 30px 50px 30px 50px;

					h3 {
						text-align: center;
						line-height: 80px;
					}

					.forget-password,
					.Verification {
						float: right;
					}

					.disabled {
						color: #ccc;
						cursor: no-drop;
					}
				}
			}

			.login-phone {
				height: 400px;
			}

			.switch-company {
				position: absolute;
				top: 50%;
				right: 12%;
				z-index: 100;
				margin-top: -200px;
				width: 406px;
				height: 440px;
				background: #fff;
				border-radius: 12px;
				overflow: hidden;

				.title {
					text-align: center;
					line-height: 80px;
					font-size: 24px;
					border-bottom: 1px solid rgba(110, 118, 131, 0.5);
				}

				.index-body {
					height: 360px;
					overflow-y: auto;

					ul {
						margin: 39px 57px;

						li {
							width: 100%;
							margin: 18px auto;
							overflow: hidden;
							position: relative;

							img {
								width: 65px;
								height: 65px;
								position: absolute;
								top: 50%;
								left: 0;
								transform: translateX(0) translateY(-50%);
							}

							p {
								margin-left: 80px;
								padding: 10px 0;

								span {
									display: block;
								}
								.companyName {
									font-size: 21px;
									color: #0d1a30;
									line-height: 30px;
								}
								.toCompany {
									font-size: 16px;
									color: #d3d5d9;
									line-height: 24px;
								}
							}
						}
					}
				}
			}

			.other-botton {
				width: 100%;
				height: 60px;
				line-height: 60px;
				margin-top: 2px;
				border-top: 1px solid rgba(110, 118, 131, 0.5);

				.el-button {
					width: 48%;
					text-align: center;
				}
			}

			.forgetPassword,
			.company {
				position: absolute;
				top: 50%;
				left: 50%;
				z-index: 100;
				margin-top: -250px;
				margin-left: -200px;
				width: 406px;
				height: 480px;
				background: #fff;
				border-radius: 12px;
				overflow: hidden;

				.el-form {
					padding: 30px 50px 30px 50px;

					h3 {
						text-align: center;
						line-height: 80px;
					}

					.el-form-item {
						margin-top: 16px;
					}
				}
			}

			.scan-code {
				position: absolute;
				top: 50%;
				z-index: 99;
				right: 12%;
				margin-top: -200px;
				width: 406px;
				height: 440px;
				background: #fff;
				border-radius: 12px;
				overflow: hidden;

				.el-form {
					padding: 30px 50px 20px 50px;

					h3 {
						text-align: center;
						line-height: 40px;

						span {
							display: block;
							font-weight: 400;
							font-size: 16px;
						}
					}

					.el-form-item {
						position: relative;
						margin: 0;

						img {
							width: 54%;
							height: 54%;
							margin: 6% 23%;
						}

						dl,
						p {
							position: absolute;
							top: 50%;
							left: 50%;
							width: 54%;
							height: 75%;
							margin: -29% 0 0 -27%;
							text-align: center;
							z-index: 100;

							dt {
								line-height: 60px;
								margin-top: 15px;
								font-size: 20px;
							}

							dd {
								line-height: 60px;
							}
						}

						p {
							z-index: 99;
						}
					}
				}

				.scan-button {
					width: 100%;
					height: 55px;
					line-height: 55px;
					border-top: 1px solid rgba(110, 118, 131, 0.5);

					.el-button {
						margin: 0 8.5%;
					}
				}
			}
		}

		.el-footer {
			width: 100%;
			background: #fff;
			height: 30px !important;

			ul {
				margin: 0 auto;
				height: 30px;
				text-align: center;
				padding: 0;
				color: #6e7683;
				font-size: 14px;
				overflow: hidden;

				li {
					display: inline-block;
					line-height: 34px;

					a:hover {
						color: #5596ff;
					}
				}
			}
		}
	}
}
</style>
