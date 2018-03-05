import introJs from 'intro.js';
import { Base64 } from 'js-base64';

import fetchWrapper from 'model/fetchWrapper';

import getCookieByName from 'lib/getCookieByName';

function updateGuided(guidedStatus) {
	return fetchWrapper({
		url: '/rest/member/updateGuided',
		options: {
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json; charset=utf-8',
			}),
			body: JSON.stringify({
				guidedStatus,
			}),
		},
	});
}

function openSideBar() {
	for (let i = 1; i < 4; i += 1) {
		const $navitem = $(`#navitem${i}`);
		$navitem.addClass('show');
		$navitem.prev().removeClass('show');
	}
}

export default function dashboard() {
	const mInfo = JSON.parse(Base64.decode(getCookieByName('m_info')));
	const video = $('#video')[0];
	if (mInfo.guidedStatus === 'open') {
		openSideBar();
		const ijs = introJs.introJs();
		ijs.setOptions({
			skipLabel: '離開',
			prevLabel: '上一步',
			nextLabel: '下一步',
			doneLabel: '結束',
			showStepNumbers: false,
			showProgress: true,
			steps: [{
				element: '#navTrain',
				intro: '上傳有人臉的照片，並標記姓名，進行人臉模型訓練，相同人名的照片會自動合併為一個人臉模型',
			}, {
				element: '#navModel',
				intro: '瀏覽目前有的人臉模型',
			}, {
				element: '#navRecognize',
				intro: '上傳影片進行辨識，會比對人臉模型內的人物出現在影片的時間點',
			}, {
				element: '#navJson',
				intro: '查詢辨識引擎回傳的JSON格式',
			}, {
				element: '#navVideos',
				intro: '辨識引擎相關的介紹影片',
			}, {
				element: '#navDocuments',
				intro: '下載辨識引擎相關文件',
			}, {
				element: '#navDownload',
				intro: '申請引擎試用，分為CMD版本及COM元件版本，試用期為一個月',
			}, {
				element: '#navResetpassword',
				intro: '修改註冊預設密碼',
			}],
		});
		ijs.onbeforeexit(() => {
			if ($('#inputNoShowIntro')[0].checked) updateGuided('closed');
		});
		ijs.onexit(() => {
			video.play();
		});
		ijs.start();
		const noShowHtml = '<input type="checkbox" id="inputNoShowIntro"/><label for="inputNoShowIntro" style="font-size:14px;">以後不再顯示</label>';
		$(noShowHtml).insertAfter('.introjs-progress');
	} else if (mInfo.guidedStatus === 'closed') {
		video.play();
	}
}
