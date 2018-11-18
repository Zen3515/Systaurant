/*
 * promo.js
 * use for managing everything releated to promotion
 */

const login = require("./login.js");
const mysql_connect = require("../db/connectDB.js");

//////// API //////

const issue_command = (res, command) => {
	mysql_connect((db) => {
		db.query(command, (err, result) => {
			if (err) {
				res.status(400).send(JSON.stringify({
					message: err,
				}));
			} else {
				res.send(JSON.stringify({
					message: "OK",
				}));
			}
		});
	});
};

/* read all promos
 * Request {}
 * Response 
 * {
 *      message:        // status message
 *      list:           // data
 * }
 */
const read = (req, res) => {

	const command = "SELECT * FROM `PROMOTION`";

	mysql_connect((db) => {
		db.query(command, (err, result) => {
			if (err) {
				res.status(400).send(JSON.stringify({
					message: err,
				}));
			} else {
				res.send(JSON.stringify({
					message: "OK",
					list: result,
				}));
			}
		});
	});
};

/*
 * create a promo
 * Request
 * {
 * 		name: 			// promo name	
 * 		description: 	// promo description
 * 		price: 			// promo price
 * }
 * Response
 * {
 * 		message: 		// status message
 * }
 */
const create = (req, res) => {

	login.checkManager(req, res, () => {
		if (req.session.user == null) {
			res.status(403).send(JSON.stringify({
				message: "Unauthorized",
			}));
			return;
		}

		const emp_ID 	= req.session.user.id;
		const start 	= req.body.start_date;
		const expire 	= req.body.expire_date;
		const criteria 	= req.body.criteria;
		const percent 	= req.body.percent;

		if (start === undefined || expire === undefined || criteria === undefined || percent === undefined) {
			res.status(400).send(JSON.stringify({
				message: "information is missing [start_date, expire_date, criteria, percent]",
			}));
			return;
		}

		const command = "INSERT INTO `PROMOTION` "
			+ "(`employee_ID`, `promo_start_date`, `promo_expire_date`, `criteria`, `percent`)"
			+ "VALUES "
			+ "("    + emp_ID 
			+ ", \"" + start    + "\""
			+ ", \"" + expire   + "\""
			+ ", \"" + criteria + "\""
			+ ", "   + percent  + ")";

		issue_command(res, command);
	});
};

/*
 * update a promo
 * Request
 * {
 * 		promo_ID: 		// promo id (required)
 * 		start_date: 	// promo start date (optional)
 * 		expire_date: 	// promo expire date (optional)
 *		criteria: 		// promo description (optional)
 * 		percent: 		// promo percentage (optional)
 * }
 * Response
 * {
 * 		message: // status message
 * }
 */
const update = (req, res) => {

	login.checkManager(req, res, () => {

		const promo_ID 	    = req.body.promo_ID;
		const employee_ID 	= req.session.user.id;
		const start 	    = req.body.start_date;
		const expire 	    = req.body.expire_date;
		const criteria 	    = req.body.criteria;
		const percent 	    = req.body.percent;

		if (promo_ID === undefined) {
			res.status(400).send(JSON.stringify({
				message: "no promo_ID"
			}));
			return;
		}

		if (start === undefined && expire === undefined && criteria === undefined && percent === undefined) {
			res.status(400).send(JSON.stringify({
				message: "no new information [start_date, expire_date, criteria, percent]",
			}));
			return;
		}

		const command = "UPDATE `PROMOTION` SET "
			+                        "`employee_ID` = "        + employee_ID
			+ (start 		? ", " + "`promo_start_date` = "   + start        : "")
			+ (expire		? ", " + "`promo_expire_date` = "  + expire       : "")
			+ (criteria		? ", " + "`criteria` = "           + criteria     : "")
			+ (percent		? ", " + "`percent` = "            + percent      : "")
			+ " WHERE `promo_ID` = " + promo_ID;

		issue_command(res, command);
	});
};

/*
 * remove a promo
 * Request
 * {
 * 		promo_ID: 	// promo id
 * }
 * Response
 * {
 * 		message: 	// status message
 * }
 */
const remove = (req, res) => {

	login.checkManager(req, res, () => {
		const promo_ID = req.body.promo_ID;

		if (promo_ID === undefined) {
			res.status(400).send(JSON.stringify({
				message: "no promo_ID",
			}));
			return;
		}

		const command = "DELETE FROM `PROMOTION` WHERE `promo_ID` = " + promo_ID;

		issue_command(res, command);
	});
};

//////// UI ///////
// TODO
const ui = (req, res) => {
	res.send("promo page");
};

module.exports = {

	// promo JSON api
	read:   read,
	create: create,
	update: update,
	remove: remove,

	// promo ui
	ui: ui
};
