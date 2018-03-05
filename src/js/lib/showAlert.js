export default function showAlert(text, type, option = {
	duration: null,
}) {
	let html = '';
	switch (type) {
		case 'success':
			html = `<li class="alert alert-success"><i class="fa fa-check-circle"></i>
								<div class="alert-block">
									<div class="alert-title">Success</div>
									<div class="alert-message">${text}</div>
									${option.duration ? '' : '<em>點擊關閉</em>'}
								</div>
							</li>`;
			break;
		case 'info':
			html = `<li class="alert alert-info"><i class="fa fa-info-circle"></i>
								<div class="alert-block">
									<div class="alert-title">Info</div>
									<div class="alert-message">${text}</div>
									${option.duration ? '' : '<em>點擊關閉</em>'}
								</div>
							</li>`;
			break;
		case 'warning':
			html = `<li class="alert alert-warning"><i class="fa fa-exclamation-circle"></i>
								<div class="alert-block">
									<div class="alert-title">Warning</div>
									<div class="alert-message">${text}</div>
									${option.duration ? '' : '<em>點擊關閉</em>'}
								</div>
							</li>`;
			break;
		case 'danger':
			html = `<li class="alert alert-error"><i class="fa fa-minus-circle"></i>
								<div class="alert-block">
									<div class="alert-title">Error</div>
									<div class="alert-message">${text}</div>
									${option.duration ? '' : '<em>點擊關閉</em>'}
								</div>
							</li>`;
			break;
		default:
			break;
	}
	let $alerts = $('#alerts');
	if (!$alerts.length) {
		$alerts = $('<ul id="alerts"></ul>');
		$('body').append($alerts);
	}
	const $alert = $(html);
	const leave = () => {
		$alert.removeClass('open');
		$alert.one(
			'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
			() => $alert.remove(),
		);
	};
	$alerts.append($alert);
	setTimeout(() => $alert.addClass('open'), 1);

	$alert.on('click', leave);
	if (option.duration) {
		setTimeout(() => {
			leave();
		}, option.duration);
	}
}
