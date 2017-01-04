// js for views/importSchedule.ejs

import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/startSetup.css';
import $ from 'jquery';

$(() => {
	setTimeout(() => {
		$.post('/importSchedule', {}, (data) => {
			let dataObject = {
				accessToken: data.accessToken,
				accessSecret: data.accessSecret
			};
			localStorage.setItem('twitterTokens', JSON.stringify(dataObject));
		});
	}, 3000);

	$('#submitButton').click(() => {
		let twitchUsername = $('#twitchUsername').val();
		let horaro = $('#horaroLink').val();

		if (horaro.length === 0 || twitchUsername.length === 0) {
			return errorText('Please fill out both fields');
		}
		$.post('/validateSettings', { twitch: `twitchUsername`, horaro: horaro }, (data) => {
			if (data.constructor === Array) {
				let optional = JSON.stringify(data[1]);
				localStorage.setItem('optionals', optional);
				location.href = '/dashboard';
			} else {
				return errorText(data.message);
			}
		});
	});

	function errorText(text) {
		let eSpan = $('#e');
		eSpan.text(text).fadeIn(2).removeClass('hidden');
		setTimeout(() => {
			eSpan.fadeOut(2).text('').addClass('hidden');
			eSpan.text('').addClass('hidden');
		}, 4000);
	}
});
