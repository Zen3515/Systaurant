/*
 * reserve.js
 * use for seat reservation system
 */

const login = require("./login.js");
const mysql_connect = require("../db/connectDB.js");

//////// API //////

/*
 * create a reservation
 * Request
 * {
 * 		table_ID: 				// menu id	
 * 		reserve_time:			// reserve date
 *		number_of_reserved: 	// number of reserved seats 
 * }
 * Response
 * {
 * 		message: 		// status message
 * }
 */
const create = (req, res) => {

	login.checkMember(req, res, () => {

		const member_ID 			= req.session.user.id;
		const table_ID 				= req.body.table;
		const reserve_time			= req.body.reserve;
		const number_of_reserved	= req.body.number_of_reserved;

		if (table_ID === undefined || reserve_time === undefined || number_of_reserved === undefined) {
			res.status(400).send(JSON.stringify({
				message: "information is missing [table_ID, reserve_time, number_of_reserved]",
			}));
			return;
		}

		const command = "INSERT INTO `RESERVE` "
			+ "(`member_ID`, `table_ID`, `reserve_time`, `number_of_reserved`)"
			+ "VALUES "
			+ "("    + member_ID 
			+ ", "   + table_ID 
			+ ", \"" + reserve_time        + "\""
			+ ", "   + number_of_reserved  + ")";

		issue_command(res, command);
	});
};

/*
 * cancel a reservation
 * Request
 * {
 * 		reserve_ID:   // reserve id
 * }
 * Response
 * {
 * 		message: 	  // status message
 * }
 */
const cancel = (req, res) => {

	login.checkMember(req, res, () => {

		const reserve_ID   = req.body.reserve_ID;
		const member_ID    = req.session.user.id;

		if (reserve_ID === undefined) {
			res.status(400).send(JSON.stringify({
				message: "no order id",
			}));
			return;
		}

		const command1 = "SELECT table_ID, reserve_time FROM `RESERVE`"
			+ "WHERE `reserve_ID` = " + reserve_ID + " "
			+ "AND `member_ID` = " + member_ID + " ";

		const command2 = "DELETE FROM `RESERVE` WHERE `reserve_ID` = " + reserve_ID;

		mysql_connect((db) => {
			db.query(command1, (err, res) => {
				if (err) {
					res.status(400).send(JSON.stringify({
						message: err,
					}));
				} else if (res.length !== 1) {
					res.status(400).send(JSON.stringify({
						message: "ID doesn't match a record",
					}));					
				} else {
					db.query(command2, (err, res) => {
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
				}
			});
		})
	});
};

//////// UI ///////
// TODO
const ui = (req, res) => { res.sendFile("reserve.html", {
	root: __dirname  + '/../view'
}); };

module.exports = {

	// reserve JSON api
	create: create,
	cancel: cancel,

	// reserve ui
	ui: ui,
};
