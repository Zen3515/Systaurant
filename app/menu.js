/*
 * menu.js
 * use for managing everything releated to menu
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
 * create a menu
 * Request
 * {
 * 		name: 			// menu name	
 * 		description: 	// menu description
 * 		price: 			// menu price
 * }
 * Response
 * {
 * 		message: 		// status message
 * }
 */
const create = (req, res) => {

	const name = req.body.name;
	const description = req.body.description;
	const price = req.body.price;

	if (name === undefined || description === undefined || price === undefined) {
		res.status(400).send(JSON.stringify({
			message: "information is missing [name, description, price]",
		}));
		return;
	}

	const command = "INSERT INTO `MENU` (`menu_name`, `menu_description`, `price`) VALUES (\"" + name + "\",\"" + description + "\"," + price + ")";

	issue_command(res, command);
};

/*
 * update a menu
 * Request
 * {
 * 		id: 			// menu id (required)
 * 		name: 			// menu name (optional)
 * 		description: 	// menu description (optional)
 * 		price: 			// menu price (optional)
 * }
 * Response
 * {
 * 		message: 		// status message
 * }
 */
const update = (req, res) => {

	const id = req.body.id;
	const name = req.body.name;
	const description = req.body.description;
	const price = req.body.price;

	if (id === undefined) {
		res.status(400).send(JSON.stringify({
			message: "no menu id"
		}));
		return;
	}

	if (name === undefined && description === undefined && price === undefined) {
		res.status(400).send(JSON.stringify({
			message: "no new informationk [name, description, price]",
		}));
		return;
	}

	const command = "UPDATE `MENU` SET "
		+ (name 		? "`menu_name` = \"" + name + "\"" : "")
		+ (description 	? (name ? ", " : " ") + "`menu_description` = \"" + description + "\"" : "")
		+ (price 		? (name || description ? ", " : " ") + "`price` = " + price : "")
		+ " WHERE `menu_ID` = " + id;

	issue_command(res, command);
};

/*
 * remove a menu
 * Request
 * {
 * 		id: 			// menu id
 * }
 * Response
 * {
 * 		message: 		// status message
 * }
 */
const remove = (req, res) => {
	const id = req.body.id;

	if (id === undefined) {
		res.status(400).send(JSON.stringify({
			message: "no menu id",
		}));
		return;
	}

	const command = "DELETE FROM `MENU` WHERE `menu_ID` = " + id;

	issue_command(res, command);
};

//////// UI ///////
// TODO
const ui = (req, res) => {
	res.send("menu page");
};

module.exports = {

	// menu JSON api
	create: create,
	update: update,
	remove: remove,

	// menu ui
	ui: ui,
};
