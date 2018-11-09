/*
 * login.js
 * use for all authentication in the system
 *
 */

const sha256 = require("sha256");
const mysql_connect = require("../db/connectDB.js");

//////// Middleware //////

const checkAuthen = (req, res, next) => {
	if (req.session !== undefined && req.session.user !== undefined) {
		next();
	} else {
		res.status(403).send("Unauthorized");
	}
};

const checkMember = (req, res, next) => {
	return checkAuthen(req, res, () => {
		if (req.session.user.type === "member") {
			next();
		} else {
			res.status(403).send("Unauthorized");
		}
	});
};

const checkEmployee = (req, res, next) => {
	return checkAuthen(req, res, () => {
		if (req.session.user.type === "employee") {
			next();
		} else {
			res.status(403).send("Unauthorized");
		}
	});
};

const checkManager = (req, res, next) => {
	return checkEmployee(req, res, () => {
		if (req.session.user.employee_type == "manager") {
			next();
		} else {
			res.status(403).send("Unauthorized");
		}
	});
};

//////// UI //////////////
// TODO
const ui = (req, res) => { res.send("login page"); };

//////// API /////////////
/*
 * login
 * check the validity of the authenticator
 * Request
 * {
 * 		type: // "member" or "employee"
 * 		id: // id of the member
 * 		password: // password for verification
 * }
 * Reponse
 * {
 * 		message: // status of the authentication 
 * 			// if OK the session is created.
 *			// if not the error message is returned
 * }
 */

const initiateSession = (req) => {
	req.session.user = {};
	req.session.user.type = req.body.type;
	req.session.user.id = req.body.id;
};

const login = (req, res) => {

	if (req.body === undefined) {
		res.status(400).send(JSON.stringify({
			message: "JSON parsing failed",
		}));
		return;
	}

	const type = req.body.type;
	const id = req.body.id;
	const pass = req.body.password;

	if (type === undefined || id === undefined || pass === undefined) {
		res.status(400).send(JSON.stringify({
			message: "Some information is missing [type, id, password]",
		}));
		return;
	}

	if (["member", "employee"].indexOf(type) == -1) {
		res.status(400).send(JSON.stringify({
			message: "Invalid account type",
		}));
		return;
	}

	const command = "SELECT a.salt, a.password, p.* FROM `" + type.toUpperCase()  + "` p, `ACCOUNT` a " 
		+ `WHERE p.\`${type}_ID\` = ${id} AND p.\`account_ID\` = a.\`account_ID\``;

	mysql_connect((db) => {
		
		db.query(command, (err, user_info) => {
			if (err) {
				res.status(400).send(JSON.stringify({
					message: err,
				}));
				return;
			}

			if (user_info.length !== 1) {
				res.status(400).send(JSON.stringify({
					message: "Invalid credentail",
				}));
				return;
			}

			const user = user_info[0];
			const salt = user.salt;
			const correctPass = user.password;

			if (sha256(pass + salt) === correctPass) {
				// data is valid create session
				initiateSession(req, user);
				res.send(JSON.stringify({
					message: "OK",
				}));
			} else {
				res.status(400).send(JSON.stringify({
					message: "Invalid credential",
				}));
			}
		});
	});
};

/*
 * logout 
 * remove all sessions and cookies
 * Request: {}
 * Response: {} with redirection to '/'
 */
const logout = (req, res) => {
	req.session.destroy((err) => {
		res.redirect("/");
	});
};

module.exports = {

	// middleware
	checkAuthen: (req, res, next) => next(),
	checkMember: (req, res, next) => next(), 
	checkEmployee: (req, res, next) => next(), 
	checkManager: (req, res, next) => next(),

	// login JSON api
	login: login,
	logout: logout,

	// login ui
	ui: ui,
};
