/*
 * receipt.js
 * use for managing everything releated to billing and receipts
 */

const login = require("./login.js");
const mysql_connect = require("../db/connectDB.js");

//////// API //////

/*
 * create a receipt
 * Request
 * {}
 * Response
 * {
 *      receipt_ID:     // id of the create receipt
 * 		message: 		// status message
 * }
 */
const create = (req, res) => {

	const table_ID = req.session.table;

	mysql_connect((db) => {

		const command = "SELECT ord.`order_ID`, m.`menu_name`"
			+ ", ROUND(IFNULL(m.`price` * (100 - s.`discount`) / 100, m.`price`), 2) AS price"
			+ " FROM `ORDER` ord, `MENU` m"

			+ " LEFT JOIN"
			+ " (SELECT `menu_ID`, MAX(`discount`) AS `discount` FROM `SALE` GROUP BY `menu_ID`) s"
			+ " ON m.`menu_ID` = s.`menu_ID` "

			+ " WHERE ord.`table_ID` = " + table_ID
			+ " AND ord.`order_time` <= NOW()"
			+ " AND ord.`receipt_ID` IS NULL"
			+ " AND ord.`menu_ID` = m.`menu_ID`";		

		db.query(command, (err, result) => {
			
			if (err) {
				res.status(400).send(JSON.stringify({
					message: err,
				}));					
				return; 
			}

			// get the price of the bill
			let price = 0.0;
			for (const idx in result) {
				price += result[idx].price;
			}

			price = Math.round(100 * price) / 100;

			if (price <= 0.00) {
				// no receipt here
				res.status(400).send(JSON.stringify({
					message: "No order is made",
				}));
				return;
			}

			// generate create and update queries
			const command1 = "INSERT INTO `RECEIPT`"
				+ " (`table_ID`, `total_price`)"
				+ " VALUES (" + table_ID + ", " + price + ")";

			const command2 = "UPDATE `ORDER`"
				+ " SET `receipt_ID` = LAST_INSERT_ID()"
				+ " WHERE `table_ID` = " + table_ID
				+ " AND `order_time` < NOW()"
				+ " AND `receipt_ID` IS NULL";
			
			const command3 = "SELECT LAST_INSERT_ID() AS ID";

			db.query(command1, (err, result) => {
				if (err) {
					res.status(400).send(JSON.stringify({
						message: err,
					}));
				} else {
					db.query(command2, (err, result) => {
						if (err) {
							res.status(400).send(JSON.stringify({
								message: err,
							}));
						} else {
							db.query(command3, (err, result) => {
								if (err) {
									res.status(400).send(JSON.stringify({
										message: err,
									}));
								} else if (result.length == 0) {
									res.status(400).send(JSON.stringify({
										message: "No new ID",
										recept_ID: -1,
									}));
								} else {

									// add receipt to the ID
									req.session.receipt = result[0].ID;

									res.send(JSON.stringify({
										message: "OK",
										receipt_ID: result[0].ID,
									}));
								}
							});
						}
					});	
				}
			});
		});
	});
};

/*
 * read a receipt
 * Request
 * {}
 * Response
 * {
 * 		message: 	// status message
 *      receipt:    // information about receipt
 * }
 */
const read = (req, res) => {

	const receipt_ID = req.session.receipt;

	const command = "SELECT * FROM `RECEIPT`"
		+ " WHERE `receipt_ID` = " + receipt_ID
		+ " ORDER BY `issue_date` DESC"
		+ " LIMIT 1";

	mysql_connect((db) => {
		db.query(command, (err, result) => {

			if (err) {
				res.status(400).send(JSON.stringify({
					message: err,
				}));
			} else {
				if (result.length === 0) {
					res.status(400).send(JSON.stringify({
						message: "No receipt found.",
					}));	
				} else {
					res.send(JSON.stringify({
						message: "OK",
						receipt: result[0],
					}));
				}
			}
		});
	});
};

//////// UI ///////
// TODO
const ui = (req, res) => { res.sendFile("receipt.html", {
	root: __dirname  + '/../view'
}); };

module.exports = {

	// promo JSON api
	create: create,
	read:   read,

	// promo ui
	ui: ui
};
