/*
 * login.js
 * use for all authentication in the system
 *
 */

const sha256 = require('sha256');
const mysql_connect = require('../db/connectDB.js');

//////// Middleware //////

const checkAuthen = (req, res, next) => {
  if (req.session !== undefined && req.session.user !== undefined) {
    next();
  } else {
    res.status(403).send('Unauthorized');
  }
};

const checkMember = (req, res, next) => {
  return checkAuthen(req, res, () => {
    if (req.session.user.type === 'member') {
      next();
    } else {
      res.status(403).send('Unauthorized');
    }
  });
};

const checkEmployee = (req, res, next) => {
  return checkAuthen(req, res, () => {
    if (req.session.user.type === 'employee') {
      next();
    } else {
      res.status(403).send('Unauthorized');
    }
  });
};

const checkManager = (req, res, next) => {
	return checkEmployee(req, res, () => {
		if (req.session.user.employee_type == 2) {
			next();
		} else {
			res.status(403).send("Unauthorized");
		}
	});
};

const checkTable = (req, res, next) => {
	if (req.session !== undefined && req.session.table !== undefined) {
		next();
	} else {
		res.status(403).send("Unauthorized");
	}
};

//////// UI //////////////
// TODO
const ui = (req, res) => {
  res.sendFile('login.html', {
    root: __dirname + '/../view'
  });
};

const table_ui = (req, res) => {
  res.sendFile('login_table.html', {
    root: __dirname + '/../view'
  });
};

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

const login = (req, res) => {

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
		+ ` WHERE (p.${type}_ID = ${id} OR a.firstname = ${id})`
	    + ` AND p.account_ID = a.account_ID`;

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
					message: "Invalid credential",
				}));
				return;
			}

			const user = user_info[0];
			const salt = user.salt;
			const correctPass = user.password;

			if (sha256(pass + salt) === correctPass) {
				
				// data is valid create session
				req.session.user = user;
				req.session.user.type = req.body.type;
				req.session.user.id = req.body.id;

				req.session.save();
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
 * login_table
 * check the validity of the authenticator
 * Request
 * {
 *      api: // id of the table
 * }
 * Reponse
 * {
 * 		message: // status of the authentication
 * }
 */

const login_table = (req, res) => {
  const api = req.body.api;

  if (api === undefined) {
    res.status(400).send(
      JSON.stringify({
        message: 'Some information is missing [api]'
      })
    );
    return;
  }

  const command =
    'SELECT table_ID FROM `TABLE` ' + `WHERE \`table_ID\` = ${api}`;

  mysql_connect(db => {
    db.query(command, (err, table_info) => {
      if (err) {
        res.status(400).send(
          JSON.stringify({
            message: err
          })
        );
        return;
      }

      if (table_info.length !== 1) {
        res.status(400).send(
          JSON.stringify({
            message: 'Invalid table api key'
          })
        );
        return;
      }

      const id = table_info[0].table_ID;

      // set table id
      req.session.table = id;

      res.send(
        JSON.stringify({
          message: 'OK'
        })
      );
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
  req.session.destroy(err => {
    res.redirect('/');
  });
};

/*
 * status
 * return the session status
 * Request: {}
 * Response: {
 *    table:    // table_ID if the session has one
 *    employee: // true if the user is an employee
 *    member:   // true if the user is a member
 *    manager:  // true if the user is a manager
 * }
 */
const stat =  (req, res) => {

	if (req.session.user == undefined) {
		res.send(JSON.stringify({
			table: req.session.table,
			employee: false, 
			member: false,
			manager: false,
		}));
	} else {
		res.send(JSON.stringify({
			table: req.session.table,
			employee: (req.session.user.type == "employee"),
			member: (req.session.user.type == "member"),
			manager: (req.session.user.employee_type == 2),

		}));
	}
};

module.exports = {

	// middleware
	checkAuthen: 		checkAuthen,
	checkMember: 		checkMember, 
	checkEmployee: 		checkEmployee, 
	checkManager: 		checkManager,
	checkTable: 		checkTable,

	// login JSON api
	login: 				login,
	login_table:        login_table,
	logout: 			logout,
	stat:               stat, 

	// login ui
	ui: 				ui,
	table_ui:			table_ui,
};
