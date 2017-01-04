// js for views/startSetup.ejs

import '../css/startSetup.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';

$(() => {
	$('#twitterButton').click(() => {
		window.location.replace('/twitter');
	});
});
