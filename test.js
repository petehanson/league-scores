//const path = require("path");
//const { GoogleSpreadsheet } = require("google-spreadsheet");

const {ScoreSheet} = require("./src/ScoreSheet");

const run = async () => {

    const documentId = "11aIKnleoFg7655KqArCj6YpspztWCOWZxGrStd3a4bc";

    /*
    console.log(process.cwd());

    const configPath = path.resolve(process.cwd(), "./config/league-scores-b0e7a965636f.json");
    console.log(configPath);

    const creds = require(configPath);
    console.log(creds);

    /*
    const creds = require('./config/league-scores-b0e7a965636f.json'); // the file saved above
    console.log(creds);

    const doc = new GoogleSpreadsheet(docId);

    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();

    console.log(doc.sheetCount);

    const sheets = doc.sheetsByTitle;
    console.log(Object.keys(sheets));

    const configSheet = sheets['config'];

    await configSheet.loadHeaderRow();
    console.log(configSheet.headerValues);

    await configSheet.loadCells({
        endRowIndex: 100,
        endColumnIndex: configSheet.headerValues.length - 1
    });

    const columnValues = (sheet,columnIndex) => {
        const values = [];
        for (let i = 1; i < 100; i++) {
            const cell = sheet.getCell(i,columnIndex);
            values.push(cell.formattedValue);
        }

        return values.filter((cur)=>{
            return (cur !== null);
        });
    };

    const sessions = columnValues(configSheet,0);
    const players = columnValues(configSheet,1);

    */

    /*
    await configSheet.loadCells("A1:C100")
    console.log(configSheet.title);
    */
   /*
    console.log(configSheet.getCell(0,0).value);


    const testSheet = sheets['test'];

    await testSheet.addRow({name: "Pete",score: 100});
    */

    const ss = new ScoreSheet({documentId});

    /*
    const configs = await ss.configuration();
    console.log(configs);

    console.log(await ss.recordScore({

        session: "10/11/2021",
        court: "Court 1",
        set: "Set 1",
        player1: "Pete H",
        hasSub1: 0,
        player2: "Kate H",
        hasSub2: 0,
        player3: "Tom N",
        hasSub3: 0,
        player4: "Ed P",
        hasSub4: 1,
        score1: 4,
        score2: 6
    }));
    */

    console.log(await ss.nextSession());
    console.log(await ss.nextSession("2021-10-05T20:45:00-05:00"));
    console.log(await ss.nextSession("2021-10-10T20:45:00-05:00"));
    console.log(await ss.nextSession("2021-10-11T00:00:00-05:00"));

    return true;
}

run()
    .then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.error(error);
    });