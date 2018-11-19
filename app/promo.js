/*
 * promo.js
 * use for managing everything releated to promotion
 */

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
 *      promo:           // data
 * }
 */
const read = (req, res) => {

	const id      = req.session.user.id;
	const command = "SELECT * FROM `PROMOTION`"
		+ " WHERE `employee_ID` = " + id;

	mysql_connect((db) => {
		db.query(command, (err, result) => {
			if (err) {
				res.status(400).send(JSON.stringify({
					message: err,
				}));
			} else {
				res.send(JSON.stringify({
					message: "OK",
					promo: result,
				}));
			}
		});
	});
};

/*
 * create a promo
 * Request
 * {
 *      pro_start_date:    // start date
 *      pro_expire_date:   // expire date
 *      criteria:          // criteria
 *      discount_percent:  // discount
 * }
 * Response
 * {
 * 		message: 		// status message
 * }
 */
const create = (req, res) => {

	const emp_ID 	= req.session.user.id;
	const start 	= req.body.pro_start_date;
	const expire 	= req.body.pro_expire_date;
	const criteria 	= req.body.criteria;
	const discount 	= req.body.discount_percent;

	if (start === undefined || expire === undefined || criteria === undefined || discount === undefined) {
		res.status(400).send(JSON.stringify({
			message: "information is missing [start_date, expire_date, criteria, discount_percent]",
		}));
		return;
	}

	const command = "INSERT INTO `PROMOTION` "
		+ "(`employee_ID`, `pro_start_date`, `pro_expire_date`, `criteria`, `discount_percent`)"
		+ "VALUES "
		+ "("    + emp_ID 
		+ ", \"" + start    + "\""
		+ ", \"" + expire   + "\""
		+ ", \"" + criteria + "\""
		+ ", "   + discount + ")";

	issue_command(res, command);
};

/*
 * update a promo
 * Request
 * {
 * 		promo_ID: 		    // promo id (required)
 * 		pro_start_date: 	// promo start date (optional)
 * 		pro_expire_date: 	// promo expire date (optional)
 *		criteria: 		    // promo description (optional)
 * 		discount_percent: 	// promo percentage (optional)
 * }
 * Response
 * {
 * 		message: // status message
 * }
 */
const update = (req, res) => {

	const promo_ID 	    = req.body.promo_ID;
	const employee_ID 	= req.session.user.id;
	const start 	    = req.body.pro_start_date;
	const expire 	    = req.body.pro_expire_date;
	const criteria 	    = req.body.criteria;
	const discount 	    = req.body.discount_percent;

	if (promo_ID === undefined) {
		res.status(400).send(JSON.stringify({
			message: "no promo_ID"
		}));
		return;
	}

	if (start === undefined && expire === undefined && criteria === undefined && discount === undefined) {
		res.status(400).send(JSON.stringify({
			message: "no new information [start_date, expire_date, criteria, discount]",
		}));
		return;
	}

	const command = "UPDATE `PROMOTION` SET "
		+             "`employee_ID` = "          + employee_ID
		+ (start 	? ", `pro_start_date` = \""   + start      + "\"" : "")
		+ (expire	? ", `pro_expire_date` = \""  + expire     + "\"" : "")
		+ (criteria	? ", `criteria` = \""         + criteria   + "\"" : "")
		+ (discount	? ", `discount_percent` = "   + discount          : "")
		+ " WHERE `promo_ID` = " + promo_ID;

	issue_command(res, command);
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

	const promo_ID = req.body.promo_ID;

	if (promo_ID === undefined) {
		res.status(400).send(JSON.stringify({
			message: "no promo_ID",
		}));
		return;
	}

	const command = "DELETE FROM `PROMOTION`"
		+ " WHERE `promo_ID` = " + promo_ID;

	issue_command(res, command);
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
