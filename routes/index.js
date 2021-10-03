const {ScoreSheet} = require("../src/ScoreSheet");

var express = require('express');
var router = express.Router();

router.get('/', (req,res,next) => {

	const leagueConfig = require("../config/leagues.json");

	res.render('index', {
		leagues: Object.keys(leagueConfig).map((cur)=>{
			return {key: cur, value: leagueConfig[cur]['name']};
		})
	});
});

module.exports = router;