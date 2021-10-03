const {ScoreSheet} = require("../src/ScoreSheet");

var express = require('express');
var router = express.Router();

const scoreController = (req,res,next) => {
    const run = async () => {

		const leagueConfig = require("../config/leagues.json");

		const leagueId = req.params.leagueId || null;
		console.log("League ID: %s",leagueId);

		if (leagueId === null) throw new Error("League ID can't be null");


		const ss = new ScoreSheet({
			documentId: leagueConfig[leagueId]['documentId']
		});


		const ssConfigs = await ss.configuration();

        let message = null;

		if (req.method == "POST") {
			const body = req.body;
			console.log("Submitted Body", body);
            await ss.recordScore(body);
            message = "Saved Scores"
		}


		return Object.assign({
            message,
            leagueName: leagueConfig[leagueId]['name'],
			session: req.body['session'] || await ss.nextSession(),
			court: req.body['court'] || null,
		},ssConfigs);

    }

    run()
        .then((viewData) => {
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