// mostly here to validate the user input
const request = require('request');
const tokens = require('../tokens.json');
module.exports = (app) => {
	app.post('/validateSettings', (req, res) => {
		const twitch = req.body.twitch;
		const horaro = req.body.horaro;
		console.log('Reeeeee');

		// var to save if the optional collums exist
		let optional = {
			console: false,
			linkToProfile: false
		};

		// first of all: check if twitch is valid
		request(`https://api.twitch.tv/kraken/channels/${twitch}?client_id=${tokens.twitch.id}`, (error, result, body) => {
			let info = JSON.parse(body);
			if (info.error === 'Not Found') {
				return res.send({
					status: 'error',
					message: `Couldn't find a user with the Twitchname of ${twitch}`
				});
			} else if (info.message === 'No client id specified') {
				return res.send({
					status: 'error',
					message: 'Something is going really wrong! Please conctact me as soon as possible (Discord: Onestay|ステー#9756)'
				});
			}
			// these are some collum names wich identify if there is a fourth collum pointing to any of the runners socail media
			const linkWords = ['twitch username', 'twitter profile', 'facebook profile', 'twitch username(s)', 'twitter profile(s)', 'facebook profile(s)',
				'speedrun.com profile', 'speedrun.com profile(s)'];
			request(`${horaro}.json`, (errorH, resultH, bodyH) => {
				try {
					let infoH = JSON.parse(bodyH);
					if (infoH.schedule.columns[0].toLowerCase() !== 'game') return res.send({ status: 'error', message: 'It doesn\'t look like "Game" is the first collum.' });
					if (infoH.schedule.columns[1].toLowerCase() !== 'runners' && infoH.schedule.columns[1].toLowerCase() !== 'runner(s)') return res.send({ status: 'error', message: 'It doesn\'t look like "Runner(s)" is the second collum.' });
					if (infoH.schedule.columns[2].toLowerCase() !== 'category') return res.send({ status: 'error', message: 'It doesn\'t look like "Category" is the third collum.' });
					if (infoH.schedule.columns[3].toLowerCase() === 'console') optional.console = true;
					if (linkWords.indexOf(infoH.schedule.columns[4].toLowerCase) !== -1) optional.linkToProfile = true;
					res.send([
						{
							status: 'ok',
							message: 'All checks passed!'
						},
						optional
					]);
				} catch (e) {
					return res.send({
						status: 'error',
						message: 'Couldn\'t find the schedule'
					});
				}
			});
		});
	});
};

