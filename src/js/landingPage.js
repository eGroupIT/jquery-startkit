import fetchWrapper from 'model/fetchWrapper';
import validator from 'model/validator';

import getUrlVar from 'lib/getUrlVar';
import fetchs from 'lib/fetchs';
import statusAlert from 'lib/statusAlert';
import facebookgraphapi from 'lib/facebookgraphapi';

function now() {
	let transparent = true;
	let scrollDistance;

	function debounce(func, wait, immediate) {
		let timeout;
		return function wrapper() {
			const context = this;
			const args = arguments;
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				timeout = null;
				if (!immediate) func.apply(context, args);
			}, wait);
			if (immediate && !timeout) func.apply(context, args);
		};
	}

	const nowuiKit = {
		misc: {
			navbar_menu_visible: 0,
		},

		checkScrollForTransparentNavbar: debounce(() => {
			if ($(document).scrollTop() > scrollDistance) {
				if (transparent) {
					transparent = false;
					$('.navbar[color-on-scroll]').removeClass('navbar-transparent');
				}
			} else if (!transparent) {
				transparent = true;
				$('.navbar[color-on-scroll]').addClass('navbar-transparent');
			}
		}, 17),
	};

	$(document).ready(() => {
		$('[data-toggle="tooltip"], [rel="tooltip"]').tooltip();

		const $navbar = $('.navbar[color-on-scroll]');
		scrollDistance = $navbar.attr('color-on-scroll') || 500;

		if ($('.navbar[color-on-scroll]').length !== 0) {
			nowuiKit.checkScrollForTransparentNavbar();
			$(window).on('scroll', nowuiKit.checkScrollForTransparentNavbar);
		}
	});

	$(document).on('click', '.navbar-toggler', function onNavbarTogglerClick() {
		const $toggle = $(this);

		if (nowuiKit.misc.navbar_menu_visible === 1) {
			$('html').removeClass('nav-open');
			nowuiKit.misc.navbar_menu_visible = 0;
			$('#bodyClick').remove();
			setTimeout(() => {
				$toggle.removeClass('toggled');
			}, 550);
		} else {
			setTimeout(() => {
				$toggle.addClass('toggled');
			}, 580);
			const div = '<div id="bodyClick"></div>';
			$(div).appendTo('body').click(() => {
				$('html').removeClass('nav-open');
				nowuiKit.misc.navbar_menu_visible = 0;
				setTimeout(() => {
					$toggle.removeClass('toggled');
					$('#bodyClick').remove();
				}, 550);
			});

			$('html').addClass('nav-open');
			nowuiKit.misc.navbar_menu_visible = 1;
		}
	});
}

function initModalTrial() {
	const $inputCompanyName = $('#inputCompanyName');
	const $inputContactPerson = $('#inputContactPerson');
	const $inputContactEmail = $('#inputContactEmail');
	const $formGroup = $inputContactEmail.parents('.form-group');
	$('#modalTrial').on('hidden.bs.modal', () => {
		$inputCompanyName.val('');
		$inputContactPerson.val('');
		$inputContactEmail.val('');
		$formGroup.removeClass('has-danger');
		$formGroup.removeClass('has-success');
		$inputContactEmail.removeClass('form-control-danger');
		$inputContactEmail.removeClass('form-control-success');
	});
}

function initModalRegister() {
	$('#modalRegister').on('hidden.bs.modal', function onModalRegisterHidden() {
		$(this).find('.title').text('Almost Done!').removeClass('shake animated');
		$(this).find('.text-center').removeClass('d-none');
		$(this).find('#modalRegisterContent').addClass('d-none').removeClass('fadeIn animated');
	});
}

function initVideoVoiceControl() {
	const $video = $('#video');
	const $videoVoiceControl = $('#videoVoiceControl');
	const $i = $videoVoiceControl.find('i');
	$videoVoiceControl.on('click', () => {
		if ($video[0].muted) {
			$video[0].muted = false;
			$i.addClass('fa-volume-up').removeClass('fa-volume-off');
		} else {
			$video[0].muted = true;
			$i.addClass('fa-volume-off').removeClass('fa-volume-up');
		}
	});
}

function register() {
	const $modalRegister = $('#modalRegister');
	const $buttonCloseModalRegister = $('#buttonCloseModalRegister');
	return fetchWrapper({
		url: fetchs.register.url,
		options: {
			method: 'POST',
			headers: new Headers({
				'Content-Type': 'application/json; charset=utf-8',
			}),
			body: JSON.stringify({
				name: $('#inputCompanyName').val(),
				companyName: $('#inputContactPerson').val(),
				email: $('#inputContactEmail').val(),
			}),
		},
		beforeFetch: () => {
			$buttonCloseModalRegister.addClass('invisible');
			$('#modalTrial').modal('hide');
			$modalRegister.modal();
		},
		fetchSuccess: (response) => {
			if (response.status === 200) {
				$modalRegister.find('.title').text('申請成功!').addClass('shake animated');
				$modalRegister.find('.text-center').addClass('d-none');
				$modalRegister.find('#modalRegisterContent').removeClass('d-none').addClass('fadeIn animated');
			}
		},
		fetchFailure: () => {
			$modalRegister.find('.title').text('Failure!').addClass('shake animated');
			$modalRegister.find('.text-center').addClass('d-none');
			$modalRegister.find('#modalRegisterFailureContent').removeClass('d-none').addClass('fadeIn animated');
		},
		afterFetch: (response) => {
			$buttonCloseModalRegister.removeClass('invisible');
			statusAlert(fetchs.register.alerts, response.status);
		},
	});
}

function smoothScroll() {
	$('a[href*="#"]')
		.not('[href="#"]')
		.not('[href="#0"]')
		.not('[data-toggle="modal"]')
		.click(function onLinkClick(event) {
			if (
				location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') &&
				location.hostname === this.hostname
			) {
				let target = $(this.hash);
				target = target.length ? target : $(`[name=${this.hash.slice(1)}]`);
				if (target.length) {
					$('html, body').animate({
						scrollTop: target.offset().top - 77,
					}, 1000, () => {
						const $target = $(target);
						$target.focus();
						if ($target.is(':focus')) {
							return;
						}
						$target.focus();
					});
				}
			}
		});
}

function showRegister() {
	if (getUrlVar('showRegister')) {
		$('#modalTrial').modal();
		history.replaceState(null, null, '/');
	}
}

// function slider() {
// 	$('#about-slider').owlCarousel({
// 		items: 1,
// 		loop: true,
// 		margin: 15,
// 		nav: true,
// 		navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
// 		dots: true,
// 		autoplay: true,
// 		animateOut: 'fadeOut',
// 	});
// }

export default function landingPage() {
	const $formGroupSpinner = $('.form-group-spinner');
	validator({
		form: '#formTrial',
		fields: [{
			names: ['companyname', 'contactperson'],
			isRequired: {
				message: '不能為空',
			},
		}, {
			name: 'contactemail',
			isEmail: {
				message: '格式不正確',
			},
			remote() {
				return ({
					message: 'email已被註冊',
					url: fetchs.checkAccount.url,
					options: {
						method: 'POST',
						headers: new Headers({
							'Content-Type': 'application/json; charset=utf-8',
						}),
						body: JSON.stringify({
							email: $('#inputContactEmail').val(),
						}),
					},
					beforeFetch: () => {
						$formGroupSpinner.removeClass('invisible');
					},
					fetchSuccess: (response, hideError) => {
						hideError();
					},
					fetchFailure: (response, showError) => {
						showError();
					},
					afterFetch: (response, showError, hideError, notPass) => {
						$formGroupSpinner.addClass('invisible');
						if (response.status === 298) {
							hideError();
						} else {
							showError();
							notPass();
						}
					},
				});
			},
		}],
	}, register);

	facebookgraphapi();
	now();
	smoothScroll();
	initModalTrial();
	initModalRegister();
	initVideoVoiceControl();
	showRegister();
	// slider();
}
