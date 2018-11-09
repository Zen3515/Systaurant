/*
 * sql.js
 * Direct communication with the database
 * Use for demostration only.
 */

// connect database
const mysql_connect = require("../db/connectDB.js");

/*
 * api
 *
 * Request
 * {
 * 		command: // sql command
 * }
 * Response
 * {
 * 		result:  // result from running sql
 * 		message: // server message
 * }
 */

const api = (req, res) => {

	try {

		const data = req.body;
		console.log(data);

		if (!data.hasOwnProperty("command")) {
			res.status(400).send(JSON.stringify({
				result: "",
				message: "command is not given",
			}));
			return;
		}

		mysql_connect((db) => {
			db.query(data.command, (err, result) => {
				res.send(JSON.stringify({
					result: result,
					message: err,
				}));
			});
		});

	} catch (e) {
		res.status(400).send(JSON.stringify({
			result: "",
			message: "Invalid request",
		}));
	}
};

module.exports = {

	// sql api
	api: api
};
