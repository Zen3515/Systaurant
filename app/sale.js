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

/* read all sales
 * Request {}
 * Response 
 * {
 *      message:        // status message
 *      sale:           // data
 * }
 */
const read = (req, res) => {

	const id = req.session.user.id;
	const command = "SELECT s.*, m.menu_name FROM `SALE` s, `MENU` m "
		+ " WHERE s.`employee_ID` = " + id
		+ " AND m.`menu_ID` = s.`menu_ID`"
	    + " ORDER BY s.`sale_ID`";


	mysql_connect((db) => {
		db.query(command, (err, result) => {
			if (err) {
				res.status(400).send(JSON.stringify({
					message: err,
					sale: [],
				}));
			} else {
				res.send(JSON.stringify({
					message: "OK",
					sale: result,
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
 * 		sale_start_date:   // start date
 *		sale_expire_date:  // expire date (optional)
 * 		discount:     // sale discount percentage
 * }
 * Response
 * {
 * 		message: // status message
 * }
 */
const create = (req, res) => {

	const menu_ID  		= req.body.menu_ID;
	const start_date 	= req.body.sale_start_date;
	const expire_date 	= req.body.sale_expire_date;
	const employee_ID	= req.session.user.id;
	const discount 		= req.body.discount;

	if (menu_ID === undefined || start_date === undefined || expire_date === undefined || discount === undefined) {
		res.status(400).send(JSON.stringify({
			message: "information is missing [menu_ID, start_date, expire_date, discount]",
		}));
		return;
	}

	const command = "INSERT INTO `SALE` "
		+ "(`menu_ID`, `sale_start_date`, `sale_expire_date`, `employee_ID`, `discount`)"
		+ "VALUES " 
		+ "("    + menu_ID
		+ ", \"" + start_date    + "\""
		+ ", \"" + expire_date   + "\""
		+ ", " + employee_ID  
		+ ", "   + discount      + ")";

	issue_command(res, command);
};

/*
 * update a sale
 * Request
 * {
 * 		sale_ID: 		    // sale id
 * 		menu_ID:            // sale menu_ID (optional)
 * 		sale_start_date: 	// sale start date (optional)
 * 		sale_expire_date: 	// sale expire date (optional)
 * 		discount: 		    // sale percentage (optional)
 * }
 * Response
 * {
 * 		message: 		    // status message
 * }
 */
const update = (req, res) => {

	const sale_ID 	    = req.body.sale_ID;
	const menu_ID       = req.body.menu_ID;
	const employee_ID 	= req.session.user.id;
	const start_date 	= req.body.sale_start_date;
	const expire_date 	= req.body.sale_expire_date;
	const discount 	    = req.body.discount;

	if (sale_ID === undefined) {
		res.status(400).send(JSON.stringify({
			message: "no sale_ID"
		}));
		return;
	}

	if (start_date === undefined && expire_date === undefined && discount === undefined && discount === undefined) {
		res.status(400).send(JSON.stringify({
			message: "no new informationk [start_date, expire_date, criteria, percent]",
		}));
		return;
	}

	const command = "UPDATE `SALE` SET "
		+ (              "`employee_ID` = "          + employee_ID            )
	    + (menu_ID     ? ", `menu_ID` = "            + menu_ID            : "")
		+ (start_date  ? ", `sale_start_date` = \""  + start_date  + "\"" : "")
		+ (expire_date ? ", `sale_expire_date` = \"" + expire_date + "\"" : "")
		+ (discount	   ? ", `discount` = "           + discount           : "")
		+ " WHERE `sale_ID` = " + sale_ID;

	issue_command(res, command);
};

/*
 * remove a sale
 * Request
 * {
 * 		sale_ID: // sale id
 * }
 * Response
 * {
 * 		message: // status message
 * }
 */
const remove = (req, res) => {
	const sale_ID = req.body.sale_ID;
	const employee_ID = req.session.user.id;

	if (sale_ID === undefined) {
		res.status(400).send(JSON.stringify({
			message: "no sale id",
		}));
		return;
	}

	const command = "DELETE FROM `SALE`"
		+ " WHERE `sale_ID` = " + sale_ID
		+ " AND `employee_ID` = " + employee_ID;

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
	read: read,

	// sale ui
	ui: ui
};
