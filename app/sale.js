/*
 * sale.js
 * use for managing everything releated to saletion
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

/*
 * create a sale
 * Request
 * {
 *		menu_ID: 	  // menu id
 * 		start_date:   // start date
 *		expire_date:  // expire date (optional)
 * 		discount:     // sale discount percentage
 * }
 * Response
 * {
 * 		message: // status message
 * }
 */
const create = (req, res) => {

	login.checkManager(req, res, () => {
		
		const menu_ID  		= req.body.menu_ID;
		const start_date 	= req.body.start_date;
		const expire_date 	= req.body.expire_date;
		const empID 		= req.session.user.id;
		const discount 		= req.body.discount;

		if (empID === undefined || start === undefined || expire === undefined || discount === undefined) {
			res.status(400).send(JSON.stringify({
				message: "information is missing [menu_ID, start_date, expire_date, discount]",
			}));
			return;
		}

		const command = "INSERT INTO `SALE` "
			+ "(`menu_ID`, `sale_start_date`, `sale_expire_date`, `employee_ID`, `discount`)"
			+ "VALUES (" 
			+ "("    + menu_ID
			+ ", "   + start_date
			+ ", \"" + expire_date   + "\""
			+ ", \"" + empID         + "\""
			+ ", "   + discount      + ")";

		issue_command(res, command);
	});
};

/*
 * update a sale
 * Request
 * {
 * 		sale_ID: 		// sale id
 * 		start_date: 	// sale start date (optional)
 * 		expire_date: 	// sale expire date (optional)
 *		criteria: 		// sale description (optional)
 * 		percent: 		// sale percentage (optional)
 * }
 * Response
 * {
 * 		message: 		// status message
 * }
 */
const update = (req, res) => {

	login.checkManager(req, res, () => {
		if (req.session.user == null) {
			res.status(403).send(JSON.stringify({
				message: "Unauthorized",
			}));
			return;
		}

		const sale_ID 	    = req.body.sale_ID;
		const employee_ID 	= req.session.user.id;
		const start_date 	= req.body.start_date;
		const expire_date 	= req.body.expire_date;
		const criteria      = req.body.criteria;
		const discount 	    = req.body.discount;

		if (sale_ID === undefined) {
			res.status(400).send(JSON.stringify({
				message: "no sale_ID"
			}));
			return;
		}

		if (start === undefined && expire === undefined && discount === undefined) {
			res.status(400).send(JSON.stringify({
				message: "no new informationk [start_date, expire_date, criteria, percent]",
			}));
			return;
		}

		const command = "UPDATE `SALE` SET "
			+ (                   "`employee_ID` = "        + employee_ID      )
			+ (start     ? ", " + "`sale_start_date` = "    + start_date   : "")
			+ (expire    ? ", " + "`sale_expire_date` = "   + expire_date  : "")
			+ (criteria	 ? ", " + "`criteria` = "           + criteria     : "")
			+ (percent	 ? ", " + "`percent` = "            + percent      : "")
			+ " WHERE `sale_ID` = " + sale_ID;

		issue_command(res, command);
	});
};

/*
 * remove a sale
 * Request
 * {
 * 		id: // sale id
 * }
 * Response
 * {
 * 		message: // status message
 * }
 */
const remove = (req, res) => {
	const sale_ID = req.body.id;

	if (sale_ID === undefined) {
		res.status(400).send(JSON.stringify({
			message: "no sale id",
		}));
		return;
	}

	const command = "DELETE FROM `SALE` WHERE `sale_ID` = " + sale_ID;

	issue_command(res, command);
};

//////// UI ///////
// TODO
const ui = (req, res) => {
	res.send("sale page");
};

module.exports = {

	// sale JSON api
	create: create,
	update: update,
	remove: remove,

	// sale ui
	ui: ui
};
