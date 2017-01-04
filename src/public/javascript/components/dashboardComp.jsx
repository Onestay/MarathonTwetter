import React from 'react';
import $ from 'jquery';
import '../../css/dashboard.css';

$(() => {
	$.post('http://localhost:3055/getUserData', (data) => {
		localStorage.setItem('userData', JSON.stringify(data));
	});
});

module.exports = class Application extends React.Component {
	render() {
		return (
			<h1>Hello from React!</h1>
		);
	}
};


function Header(props) {
	return(
		<header>
			<h1>Hello, </h1>
		</header>
	)
}