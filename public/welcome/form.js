/* eslint-disable */
$(() => {
	if (typeof(Storage) === 'undefined') {
		return alert('Your browser does not appear to have localstorage. Please consider upgrading your browser');
	}

	var $formLogin = $('#login-form');
	var $formRegister = $('#register-form');
	var $divForms = $('#div-forms');
	var $modalAnimateTime = 300;
	var $msgAnimateTime = 150;
	var $msgShowTime = 2000;

	$('form').submit(() => {
		switch (this.id) {
			case 'login-form':
				console.log('Form submit!')
				var $lg_username = $('#login_username').val();
				var $lg_password = $('#login_password').val();
				if ($lg_username == 'ERROR') {
					msgChange($('#div-login-msg'), $('#icon-login-msg'), $('#text-login-msg'), 'error', 'glyphicon-remove', 'Login error');
				} else {
					msgChange($('#div-login-msg'), $('#icon-login-msg'), $('#text-login-msg'), 'success', 'glyphicon-ok', 'Login OK');
				}
				return false;
				break;
			case 'register-form':
				var $rg_username = $('#register_username').val();
				var $rg_email = $('#register_email').val();
				var $rg_password = $('#register_password').val();
				if ($rg_username == 'ERROR') {
					msgChange($('#div-register-msg'), $('#icon-register-msg'), $('#text-register-msg'), 'error', 'glyphicon-remove', 'Register error');
				} else {
					msgChange($('#div-register-msg'), $('#icon-register-msg'), $('#text-register-msg'), 'success', 'glyphicon-ok', 'Register OK');
				}
				return false;
				break;
			default:
				return false;
		}
		return false;
	});

	$('#login_register_btn').click(() => {
		modalAnimate($formLogin, $formRegister);
	});
	$('#register_login_btn').click(() => {
		modalAnimate($formRegister, $formLogin);
	});
	$('#login_lost_btn').click(() => {
		modalAnimate($formLogin, $formLost);
	});
	$('#lost_login_btn').click(() => {
		modalAnimate($formLost, $formLogin);
	});
	$('#lost_register_btn').click(() => {
		modalAnimate($formLost, $formRegister);
	});
	$('#register_lost_btn').click(() => {
		modalAnimate($formRegister, $formLost);
	});
	var loginUser, loginPass;

	$('#loginSendButton').click(() => {
		console.log('Form submit!')
		var $lg_username = $('#login_username').val();
		var $lg_password = $('#login_password').val();
		if ($lg_username.length === 0 || $lg_password.length === 0) return;
		if (!validateInput('login', $lg_username, $lg_password)) return;
		console.log(1);
		msgChange($('#div-login-msg'), $('#icon-login-msg'), $('#text-login-msg'), 'success', 'glyphicon-ok', 'Login OK');
	});

	$('#registerSendButton').click(() => {
		console.log('R')
		var $rg_username = $('#register_username').val();
		var $rg_email = $('#register_email').val();
		var $rg_password = $('#register_password').val();
		if ($rg_username === 0 || $rg_email === 0 || $rg_password === 0) return;
		if (!validateInput('register', $rg_username, $rg_password, $rg_email)) return;
		msgChange($('#div-register-msg'), $('#icon-register-msg'), $('#text-register-msg'), 'success', 'glyphicon-ok', 'Register OK');
	});

	/*$('#loginSendButton').click(() => {
			loginUser = $("#login_username").val();
			loginPass = $("#login_password").val();
			$.post('http://localhost:3055/login', { user: loginUser, pass: loginPass}, (data) => {
				if (data.status !== 'ok') {
					$('#loginError').css('display', 'block').html(data.message);
				} else {
					window.location.href = "http://localhost:3055/dashboard";
				}
			});
		});

	var registerUser, registerEmail, registerPass;

	$('#registerSendButton').click(() => {
		var registerUser = $('#register_username').val();
		var registerEmail = $('#register_email').val();
		var registerPass = $('#register_password').val();
		$.post('http://localhost:3055/register', { user: registerUser, pass: registerPass, email: registerEmail }, (data) => {
			if (data.status !== 'ok') {
				$('#registerError').css('display', 'block').html(data.message);
			} else {
				window.location.href = "http://localhost:3055/dashboard";
			}
		});
	});*/

	function modalAnimate($oldForm, $newForm) {
		var $oldH = $oldForm.height();
		var $newH = $newForm.height();
		$divForms.css('height', $oldH);
		$oldForm.fadeToggle($modalAnimateTime, () => {
			$divForms.animate({
				height: $newH
			}, $modalAnimateTime, () => {
				$newForm.fadeToggle($modalAnimateTime);
			});
		});
	}

	function msgFade($msgId, $msgText) {
		$msgId.fadeOut($msgAnimateTime, function() {
			$(this).text($msgText).fadeIn($msgAnimateTime);
		});
	}

	function msgChange($divTag, $iconTag, $textTag, $divClass, $iconClass, $msgText) {
		var $msgOld = $divTag.text();
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

	//function to validate if the user puts in valid data
	function validateInput(type, user, password, email) {
		const userReg = /^[a-zA-Z0-9.\-_$@*!]{3,20}$/;
		const passwordReg = /(?=^.{8,50}$)((?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=(.*\d){1,}))((?!.*[",;&|'])|(?=(.*\W){1,50}))(?!.*[",;&|'])^.*$/;
		const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (type === 'login') {
			if (!userReg.test(user)) {
				msgChange($('#div-login-msg'), $('#icon-login-msg'), $('#text-login-msg'), 'error', 'glyphicon-remove', 'Invalid username');
				return false;
			}

			if (!passwordReg.test(password)) {
				msgChange($('#div-login-msg'), $('#icon-login-msg'), $('#text-login-msg'), 'error', 'glyphicon-remove', 'Password needs at least 8 characters, one number and one uppercase letter.');
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

			if (email && !emailReg.test(email)) {
				msgChange($('#div-register-msg'), $('#icon-register-msg'), $('#text-register-msg'), 'error', 'glyphicon-remove', 'Please enter a valid email.');
				return false;
			}
			return true;
		}
	}
});
