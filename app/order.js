/*
 * order.js
 * use for ordering system
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

/*
 * create an order
 * Request
 * {
 * 		menu_ID: 		// menu id	
 * }
 * Response
 * {
 * 		message: 		// status message
 * }
 */
const create = (req, res) => {

	login.checkTable(req, res, () => {

		const menuID 		= req.body.menu_ID;
		const table_ID 		= req.session.user.table;

		const date 			= new Date();
		const order_time 	= date.getTime();

		if (menu_ID === undefined || table_ID === undefined) {
			res.status(400).send(JSON.stringify({
				message: "information is missing [menu_ID, table_ID]",
			}));
			return;
		}

		const command = "INSERT INTO `ORDER` "
			+ "(`menu_ID`, `table_ID`, `order_time`, `status`)"
			+ "VALUES (" + menu_ID + ", " + table_ID + ", \"" + order_time + "\", 0)";

		issue_command(res, command);
	});
};

/*
 * accept an order
 * can be done by only employee if and only if the employee_ID is NULL
 * Request
 * {
 * 		id: 		// order id
 * }
 * Response
 * {
 * 		message: 	// status message
 * }
 */
const accept = (req, res) => {

	login.checkEmployee(req, res, () => {

		const orderID = req.body.id;
		const empID = req.session.user.id;

		if (empID === undefined) {
			res.status(400).send(JSON.stringify({
				message: "information is missing [order_ID]",
			}));
			return;
		}

		const command = "UPDATE `ORDER` SET "
			+ "employee_ID = " + empID + " "
			+ "WHERE order_ID = " + orderID;

		issue_command(res, command);
	});
};

/*
 * cancel an order
 * can be done if and only if the employee_ID is NULL
 * Request
 * {
 * 		id: 		// order id
 * }
 * Response
 * {
 * 		message: 	// status message
 * }
 */
const cancel = (req, res) => {

	login.checkTable(() => {

		const id = req.body.id;
		const tableID = req.session.user.table;

		if (id === undefined) {
			res.status(400).send(JSON.stringify({
				message: "no order id",
			}));
			return;
		}

		const command = "DELETE FROM `ORDER` "
			+ " WHERE `order_ID` = " + id
			+ " AND `table_ID` = " + tableID 
			+ " AND `employee_ID` = NULL";

		issue_command(res, command);
	});
};

//////// UI ///////
// TODO
const ui = (req, res) => {
	res.send("order page");
};

module.exports = {

	// order JSON api
	create: 	create,
	cancel: 	cancel,
	accept: 	accept,

	// order ui
	ui: 		ui,
};
