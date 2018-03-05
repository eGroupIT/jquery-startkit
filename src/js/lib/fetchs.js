export default {
	checkAccount: {
		url: '/rest/member/checkAccount',
	},
	register: {
		url: '/rest/member/register',
		alerts: {
			default: {
				message: '申請失敗',
				type: 'danger',
				options: {
					duration: 3000,
				},
			},
		},
	},
	resetPassword: {
		url: '/rest/member/resetPassword',
		alerts: {
			200: {
				message: '密碼修改成功',
				type: 'success',
				options: {
					duration: 3000,
				},
			},
			498: {
				message: '密碼輸入錯誤',
				type: 'danger',
				options: {
					duration: 3000,
				},
			},
			default: {
				message: '修改失敗',
				type: 'danger',
				options: {
					duration: 3000,
				},
			},
		},
	},
	checkLogin: {
		url: '/rest/member/checkLogin',
		alerts: {
			200: {
				message: 'checkLogin success',
				type: 'success',
				options: {
					duration: 3000,
				},
			},
			400: {
				message: '傳入資料或資料格式錯誤',
				type: 'danger',
				options: {
					duration: 3000,
				},
			},
			498: {
				message: '密碼輸入錯誤',
				type: 'danger',
				options: {
					duration: 3000,
				},
			},
			499: {
				message: '查無此帳號',
				type: 'danger',
				options: {
					duration: 3000,
				},
			},
		},
	},
	uploadPhoto: {
		url: '/photo/upload',
		alerts: {
			200: {
				message: '相片上傳成功',
				type: 'info',
				options: {
					duration: 3000,
				},
			},
			default: {
				message: '相片上傳失敗',
				type: 'danger',
				options: {
					duration: 3000,
				},
			},
		},
	},
	retrieve: {
		url: '/rest/face/retrieve',
		alerts: {
			200: {
				message: '人臉獲取成功',
				type: 'info',
				options: {
					duration: 3000,
				},
			},
			default: {
				message: '人臉獲取失敗',
				type: 'danger',
				options: {
					duration: 3000,
				},
			},
		},
	},
	train: {
		url: '/rest/face/train',
		alerts: {
			200: {
				message: '人臉訓練完成<strong><a href="/dashboard/recognize">前往辨識</a><strong>',
				type: 'info',
			},
			default: {
				message: '人臉訓練失敗',
				type: 'danger',
				options: {
					duration: 3000,
				},
			},
		},
	},
	persistedFaceList: {
		url: '/rest/persistedFace/list',
		alerts: {
			default: {
				message: '模型獲取失敗',
				type: 'danger',
				options: {
					duration: 3000,
				},
			},
		},
	},
	uploadVideo: {
		url: '/video/upload',
		alerts: {
			200: {
				message: '影片上傳成功',
				type: 'info',
				options: {
					duration: 3000,
				},
			},
			default: {
				message: '影片上傳失敗',
				type: 'danger',
				options: {
					duration: 3000,
				},
			},
		},
	},
	recognize: {
		url: '/rest/video/recognize',
		alerts: {
			200: {
				message: '影片辨識成功',
				type: 'info',
				options: {
					duration: 3000,
				},
			},
			default: {
				message: '影片辨識失敗',
				type: 'danger',
				options: {
					duration: 3000,
				},
			},
		},
	},
	applyTrial: {
		url: '/rest/member/applyTrial',
		alerts: {
			200: {
				message: '申請成功',
				type: 'info',
				options: {
					duration: 3000,
				},
			},
			default: {
				message: '申請失敗',
				type: 'danger',
			},
		},
	},
};
