/*
 * reserve.js
 * use for seat reservation system
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

const get_table_ID = (id, table_ID, reserve_time, number_of_reserved, callback) => {

	if (table_ID) {
		callback(table_ID);
		return;
	}

	const command = 
		"SELECT `table_ID` FROM `TABLE`"
		+ " WHERE (`table_ID` NOT IN (SELECT DISTINCT(`table_ID`)"
			+ " FROM `RESERVE`"
			+ ` WHERE ABS(TIMESTAMPDIFF(MINUTE, "${reserve_time}", \`reserve_time\`)) < 30` + ")"
	    + ` AND \`number_of_seats\` >= ${number_of_reserved})`
	    + " ORDER BY `number_of_seats` ASC"
	    + " LIMIT 1";
	
	mysql_connect((db) => {
		db.query(command, (err, result) => {
			if (err || result.length == 0) {
				callback(-1);
			} else {
				callback(result[0].table_ID);
			}
		});
	});
};
/*
 * get a list of all reservation
 * Request
 * {
 * }
 * Response
 * {
 * 		message: 		// status message
 * 		list:           // list of all tables
 * }
 */
const read = (req, res) => {

	const id = req.session.user.id;

	const command = "SELECT r.*, t.`number_of_seats`"
		+ " FROM `RESERVE` r"
		+ " , `TABLE` t"
		+ " WHERE NOW() < r.`reserve_time`"
		+ " AND r.`member_ID` = " + id
	    + " AND r.`table_ID` = t.`table_ID`";
	
	mysql_connect((db) => {
		db.query(command, (err, result) => {
			if (err) {
				res.status(400).send(JSON.stringify({
					message: err,
				}));
			} else {
				res.send(JSON.stringify({
					message: "OK",
					list:    result,
				}));
			}
		});
	});
};

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

	const member_ID 			= req.session.user.id;
	const reserve_time			= req.body.reserve_time;
	const number_of_reserved	= req.body.number_of_reserved;

	get_table_ID(member_ID, req.body.table_ID, reserve_time, number_of_reserved, (table_ID) => {

		console.log(table_ID, reserve_time, number_of_reserved);

		if (table_ID === undefined || reserve_time === undefined || number_of_reserved === undefined) {
			res.status(400).send(JSON.stringify({
				message: "information is missing [table_ID, reserve_time, number_of_reserved]",
			}));
			return;
		}

		if (table_ID === -1) {
			res.send(JSON.stringify({
				message: "no table is available",
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
			db.query(command1, (err, result) => {
				if (err) {
					res.status(400).send(JSON.stringify({
						message: err,
					}));
				} else if (result.length !== 1) {
					res.status(400).send(JSON.stringify({
						message: "ID doesn't match a record",
					}));					
				} else {
					issue_command(res, command2);
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

	// getTable
	read: read,

	// reserve ui
	ui: ui,
};
