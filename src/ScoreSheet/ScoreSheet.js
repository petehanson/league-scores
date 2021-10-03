const path = require("path");
const { GoogleSpreadsheet } = require("google-spreadsheet");

const moment = require("moment");

module.exports.ScoreSheet = class ScoreSheet {

    constructor(inputProperties) {

        const configPath = path.resolve(process.cwd(), "./config/googlesheet-service-credentials.json");
        const creds = require(configPath);

        const defaultProperties = {
            documentId: null,
            credentials: creds,
            configSheetName: "config",
            scoreSheetName: "score entry",
            configRows: 100
        }
        this.properties = Object.assign({}, defaultProperties, inputProperties || {});

        if (!!this.properties.documentId == false) throw new Error("ScoreSheet expects a documentId parameter");
        if (!!this.properties.credentials == false) throw new Error("ScoreSheet expects a credentials parameter");

        this.doc = null;
        this.isInitialized = false;
        this.config = null;
    }

    async initialize() {
        const doc = new GoogleSpreadsheet(this.properties.documentId);
        await doc.useServiceAccountAuth(this.properties.credentials);
        await doc.loadInfo();

        const sheets = doc.sheetsByTitle;
        const sheetNames = Object.keys(sheets);

        if (sheetNames.includes(this.properties.configSheetName) == false) throw new Error("Google sheet " + this.properties.documentId + " does not contain a config sheet");
        if (sheetNames.includes(this.properties.scoreSheetName) == false) throw new Error("Google sheet " + this.properties.documentId + " does not contain a score entry sheet");

        this.doc = doc;
        this.isInitialized = true;
    }

    async configuration() {
        if (this.config !== null) return this.config;
        if (!this.isInitialized) await this.initialize();

        const sheets = this.doc.sheetsByTitle;
        const configSheet = sheets['config'];

        await configSheet.loadHeaderRow();

        const loadConfig = {
            startRowIndex: 0,
            startColumnIndex: 0,
            endRowIndex: this.properties.configRows,
            endColumnIndex: configSheet.headerValues.length
        }

        await configSheet.loadCells(loadConfig);
        const columnValues = (sheet, columnIndex) => {
            const values = [];
            for (let i = 1; i < 100; i++) {
                const cell = sheet.getCell(i, columnIndex);
                values.push(cell.formattedValue);
            }

            return values.filter((cur) => {
                return (cur !== null);
            });
        };

        const config = {};

        configSheet.headerValues.forEach((cur,index)=>{
            config[cur.toLowerCase()]= columnValues(configSheet,index);
        });

        this.config = config;
        return config;
    }
    /*
    {
        session: "date of session",
        court: "",
        set: "",
        player1: "",
        hasSub1: 0/1,
        player2: "",
        hasSub2: 0/1,
        player3: "",
        hasSub3: 0/1,
        player4: "",
        hasSub4: 0/1,
        score1: 0,
        score2: 0
    }

    */

    async recordScore(input) {


        const entryObject = {
            "Timestamp": moment().utc().format("MM/DD/YYYY HH:mm:ss"),
            "Session Date": input['session'],
            "Court": input['court'],
            "Set": input['set'],
            "Player": null,
            "Has Sub": 0,
            "Score": 0
        };


        const entries = [];

        entries.push(Object.assign({},entryObject,{
            "Player": input['player1'],
            "Has Sub": input['hasSub1'] || 0,
            "Score": input['score1']
        }));

        entries.push(Object.assign({},entryObject,{
            "Player": input['player2'],
            "Has Sub": input['hasSub2'] || 0,
            "Score": input['score1']
        }));

        entries.push(Object.assign({},entryObject,{
            "Player": input['player3'],
            "Has Sub": input['hasSub3'] || 0,
            "Score": input['score2']
        }));

        entries.push(Object.assign({},entryObject,{
            "Player": input['player4'],
            "Has Sub": input['hasSub4'] || 0,
            "Score": input['score2']
        }));


        if (!this.isInitialized) await this.initialize();

        const sheets = this.doc.sheetsByTitle;
        const entrySheet = sheets[this.properties.scoreSheetName];

        return await entrySheet.addRows(entries);
    }

    // finds the most recent session to today or the passed in date

    async nextSession(inputDt) {
        const localConfig = await this.configuration();

        const momentSessions = localConfig.sessions.map((cur)=>{
            return moment(new Date(cur));
        });

        const compareDt = (inputDt) ? moment(inputDt) : moment();

        const currentSessionIndex = momentSessions.reduce((acc,cur,index)=>{
            if (compareDt >= cur) {
                acc = index
            }
            return acc;
        },null);

        return (currentSessionIndex !== null) ? localConfig.sessions[currentSessionIndex] : null;
    }
}