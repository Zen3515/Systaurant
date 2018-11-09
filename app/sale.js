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
 * 		name: // sale name	
 * 		description: // sale description
 * 		price: // sale price
 * }
 * Response
 * {
 * 		message: // status message
 * }
 */
const create = (req, res) => {

	if (req.session.user == null) {
		res.status(403).send(JSON.stringify({
			message: "Unauthorized",
		}));
		return;
	}

	const empID 	= req.session.user.id;
	const start 	= req.body.start_date;
	const expire 	= req.body.expire_date;
	const discount 	= req.body.discount;

	if (empID === undefined || start === undefined || expire === undefined || discount === undefined) {
		res.status(400).send(JSON.stringify({
			message: "information is missing [start, expire, criteria, percent]",
		}));
		return;
	}

	const command = "INSERT INTO `SALE` "
		+ "(`sale_start_date`, `sale_expire_date`, `employee_ID`, `discount`)"
		+ "VALUES (" + start + ", \"" + expire + "\", \"" + empID + "\", " + discount + ")";

	issue_command(res, command);
};

/*
 * update a sale
 * Request
 * {
 * 		id: 			// sale id (required)
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

	if (req.session.user == null) {
		res.status(403).send(JSON.stringify({
			message: "Unauthorized",
		}));
		return;
	}

	const id 		= req.body.id;
	const empID 	= req.session.user.id;
	const start 	= req.body.start_date;
	const expire 	= req.body.expire_date;
	const discount 	= req.body.discount;

	if (id === undefined) {
		res.status(400).send(JSON.stringify({
			message: "no sale id"
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
		+ "`employee_ID` = " + empID
		+ (start 		? ", " + "`sale_start_date` = " + start : "")
		+ (expire		? ", " + "`sale_expire_date` = " + expire : "")
		+ (criteria		? ", " + "`criteria` = " + criteria : "")
		+ (percent		? ", " + "`percent` = " + percent : "")
		+ " WHERE `sale_ID` = " + id;

	issue_command(res, command);
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
	const id = req.body.id;

	if (id === undefined) {
		res.status(400).send(JSON.stringify({
			message: "no sale id",
		}));
		return;
	}

	const command = "DELETE FROM `SALE` WHERE `sale_ID` = " + id;

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
