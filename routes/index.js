const {ScoreSheet} = require("../src/ScoreSheet");

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    const run = async () => {

		throw new Error("Broke!");
	
		return true;
    }

    run()
        .then((result) => {
            res.render('index', { title: 'Hello World' });

        })
        .catch((error) => {
			next(error);
        });
});

module.exports = router;