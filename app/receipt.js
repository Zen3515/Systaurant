/*
 * receipt.js
 * use for managing everything releated to billing and receipts
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
 * create a receipt
 * Request
 * {
 * 		table_ID: 		// promo name
 * }
 * Response
 * {
 * 		message: 		// status message
 * }
 */
const create = (req, res) => {

	login.checkEmployee(() => {

		const table_ID = req.body.table_ID;

		const date = new Date();
		const issue_date = date.getTime();

		if (table_ID === undefined) {
			res.status(400).send(JSON.stringify({
				message: "information is missing [table_ID]",
			}));
			return;
		}


		mysql_connect((db) => {

			const command = "SELECT ord.`order_ID`, m.`price` "
				+ "FROM `ORDER` ord"
				+ ", `MENU` m "
				+ "WHERE "
				+ "ord.`table_ID` = " + table_ID + " "
				+ "AND ord.`order_time` < " + issue_date
				+ "AND ord.`receipt_ID` = NULL"
				+ "AND ord.`menu_ID` = m.`menu_ID`";

			db.query(command, (err, result) => {

				if (err) {
					res.status(500).send(JSON.stringify({
						message: "Error gathering orders",
					}));					
					return; 
				}

				// get the price of the bill
				let price = 0.0;
				for (const ord : result) {
					price += ord.price;
				}
				price = Math.round(100 * price) / 100;

				// generate create and update queries
				const command1 = "INSERT INTO `RECEIPT` "
					+ "(`table_ID`, `total_price`, `issue_date`)"
					+ "VALUES (" + table_ID + ", " + price + ", \"" + issue_date +"\")";

				const command2 = "UPDATE `ORDER` "
					+ "SET `receipt_ID` = LAST_INSERT_ID() "
					+ "WHERE `table_ID` = " + table_ID + " "
					+ "AND `order_time` < " + issue_date + " "
					+ "AND `receipt_ID` = NULL ";

				issue_command(res, command1 + ";" + command2);
			});

		});
	});

};

/*
 * remove a promo
 * Request
 * {
 * 		id: 		// promo id
 * }
 * Response
 * {
 * 		message: 	// status message
 * }
 */
const remove = (req, res) => {
	const promo_ID = req.body.id;

	if (promo_ID === undefined) {
		res.status(400).send(JSON.stringify({
			message: "no promotion id",
		}));
		return;
	}

	const command = "DELETE FROM `promotion` WHERE `promo_ID` = " + promo_ID;

	issue_command(res, command);
};

//////// UI ///////
// TODO
const ui = (req, res) => {
	res.send("promo page");
};

module.exports = {

	// promo JSON api
	create: create,
	update: update,
	remove: remove,

	// promo ui
	ui: ui
};
