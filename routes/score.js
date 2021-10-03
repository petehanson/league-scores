const {ScoreSheet} = require("../src/ScoreSheet");

var express = require('express');
var router = express.Router();

const scoreController = (req,res,next) => {
    const run = async () => {

		const leagueConfig = require("../config/leagues.json");

		const leagueId = req.params.leagueId || null;
		console.log("League ID: %s",leagueId);

		if (leagueId === null) throw new Error("League ID can't be null");

		if (req.method == "POST") {
			const body = req.body;
			console.log("Body", body);
		}

		const ss = new ScoreSheet({
			documentId: leagueConfig[leagueId]['documentId']
		});

		const ssConfigs = await ss.configuration();
		console.log(ssConfigs);


		return Object.assign({
            leagueName: leagueConfig[leagueId]['name']
		},ssConfigs);

    }

    run()
        .then((viewData) => {
			console.log("viewData",viewData);
            res.render('score', viewData);
        })
        .catch((error) => {
			next(error);
        });
};



/* GET/POST score page. */
router.get('/:leagueId', scoreController);
router.post('/:leagueId', scoreController);

module.exports = router;