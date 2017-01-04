/* eslint-disable camelcase*/
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/welcome.css';
import $ from 'jquery';
import 'tether';
import 'bootstrap';

console.log(1);
$(() => {
	console.log('2');
	if (typeof Storage === 'undefined') {
		return alert('Your browser does not appear to have localstorage. Please consider upgrading your browser');
	}

	const $formLogin = $('#login-form');
	const $formRegister = $('#register-form');
	const $divForms = $('#div-forms');
	const $modalAnimateTime = 300;
	const $msgAnimateTime = 150;
	const $msgShowTime = 2000;

	$('#login_register_btn').click(() => {
		modalAnimate($formLogin, $formRegister);
	});
	$('#register_login_btn').click(() => {
		modalAnimate($formRegister, $formLogin);
	});

	$('#loginSendButton').click(() => {
		const $lg_username = $('#login_username').val();
		const $lg_password = $('#login_password').val();
		if ($lg_username.length === 0 || $lg_password.length === 0) return;
		if (!validateInput('login', $lg_username, $lg_password)) return;
		$.post('http://localhost:3055/login', {
			user: $lg_username,
			pass: $lg_password
		}, (data) => {
			if (data.status === 'ok') {
				msgChange($('#div-login-msg'), $('#icon-login-msg'), $('#text-login-msg'), 'success', 'glyphicon-ok', 'Redirecting to dashboard...');
				window.location.href = 'http://localhost:3055/dashboard';
			} else if (data.status !== 'ok') {
				return msgChange($('#div-login-msg'), $('#icon-login-msg'), $('#text-login-msg'), 'error', 'glyphicon-remove', data.message);
			}
		});
	});

	$('#registerSendButton').click(() => {
		const $rg_username = $('#register_username').val();
		const $rg_email = $('#register_email').val();
		const $rg_password = $('#register_password').val();
		if ($rg_username === 0 || $rg_email === 0 || $rg_password === 0) return;
		if (!validateInput('register', $rg_username, $rg_password, $rg_email)) return;
		$.post('http://localhost:3055/register', {
			user: $rg_username,
			pass: $rg_password,
			email: $rg_email
		}, (data) => {
			if (data.status === 'ok') {
				msgChange($('#div-register-msg'), $('#icon-register-msg'), $('#text-register-msg'), 'success', 'glyphicon-ok', 'Redirecting to dashboard...');
				window.location.href = '/startSetup';
			} else if (data.status !== 'ok') {
				return msgChange($('#div-register-msg'), $('#icon-register-msg'), $('#text-register-msg'), 'error', 'glyphicon-remove', data.message);
			}
		});
	});

	function modalAnimate($oldForm, $newForm) {
		const $oldH = $oldForm.height();
		const $newH = $newForm.height();
		$divForms.css('height', $oldH);
		$oldForm.fadeToggle($modalAnimateTime, () => {
			$divForms.animate({ height: $newH }, $modalAnimateTime, () => {
				$newForm.fadeToggle($modalAnimateTime);
			});
		});
	}

	function msgFade($msgId, $msgText) {
		$msgId.fadeOut($msgAnimateTime, () => {
			$($msgId).text($msgText).fadeIn($msgAnimateTime);
		});
	}

	function msgChange($divTag, $iconTag, $textTag, $divClass, $iconClass, $msgText) {
		const $msgOld = $divTag.text();
		msgFade($textTag, $msgText);
		$divTag.addClass($divClass);
		$iconTag.removeClass('glyphicon-chevron-right');
		$iconTag.addClass(`${$iconClass} ${$divClass}`);
		setTimeout(() => {
			msgFade($textTag, $msgOld);
			$divTag.removeClass($divClass);
			$iconTag.addClass('glyphicon-chevron-right');
			$iconTag.removeClass(`${$iconClass} ${$divClass}`);
		}, $msgShowTime);
	}

	// function to validate if the user puts in valid data
	function validateInput(type, user, password, email) {
		const userReg = /^[a-zA-Z0-9.\-_$@*!]{3,20}$/;
		const passwordReg = /(?=^.{8,50}$)((?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=(.*\d){1,}))((?!.*[",;&|'])|(?=(.*\W){1,50}))(?!.*[",;&|'])^.*$/;
		const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (type === 'login') {
			if (!userReg.test(user)) {
				msgChange($('#div-login-msg'), $('#icon-login-msg'), $('#text-login-msg'), 'error', 'glyphicon-remove', 'Invalid username');
				return false;
			}

			if (!passwordReg.test(password)) {
				msgChange($('#div-login-msg'), $('#icon-login-msg'), $('#text-login-msg'), 'error', 'glyphicon-remove', 'at least 8 characters, a number, a uppercase letter.');
				return false;
			}
			return true;
		} else if (type === 'register') {
			if (!userReg.test(user)) {
				msgChange($('#div-register-msg'), $('#icon-register-msg'), $('#text-register-msg'), 'error', 'glyphicon-remove', 'Invalid username');
				return false;
			}

			if (!passwordReg.test(password)) {
				msgChange($('#div-register-msg'), $('#icon-register-msg'), $('#text-register-msg'), 'error', 'glyphicon-remove', 'Password needs at least 8 characters, one number and one uppercase letter.');
				return false;
			}

			if (!emailReg.test(email)) {
				msgChange($('#div-register-msg'), $('#icon-register-msg'), $('#text-register-msg'), 'error', 'glyphicon-remove', 'Please enter a valid email.');
				return false;
			}
			return true;
		}
	}
});
