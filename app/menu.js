/*
 * menu.js
 * use for managing everything releated to menu
 */

const login = require('./login.js');
const mysql_connect = require('../db/connectDB.js');

//////// API //////

const issue_command = (res, command) => {
  mysql_connect(db => {
    db.query(command, (err, result) => {
      if (err) {
        res.status(400).send(
          JSON.stringify({
            message: err
          })
        );
      } else {
        res.send(
          JSON.stringify({
            message: 'OK'
          })
        );
      }
    });
  });
};

const read = (req, res) => {
  const command = 'SELECT * FROM `MENU`';
  mysql_connect(db => {
    db.query(command, (err, result) => {
      if (err) {
        res.status(400).send(JSON.stringify({ message: err }));
      } else {
        res.send(
          JSON.stringify({
            message: 'OK',
            menu: result
          })
        );
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
  login.checkManager(req, res, () => {
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;

    if (
      name === undefined ||
      description === undefined ||
      price === undefined
    ) {
      res.status(400).send(
        JSON.stringify({
          message: 'information is missing [name, description, price]'
        })
      );
      return;
    }

    const command =
      'INSERT INTO `MENU` ' +
      '(`menu_name`, `menu_description`, `price`) ' +
      'VALUES ' +
      '("' +
      name +
      '"' +
      ',"' +
      description +
      '"' +
      ',' +
      price +
      ')';

    issue_command(res, command);
  });
};

/*
 * update a menu
 * Request
 * {
 * 		menu_ID: 		// menu id
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
  login.checkManager(req, res, () => {
    const id = req.body.menu_ID;
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;

    if (id === undefined) {
      res.status(400).send(
        JSON.stringify({
          message: 'no menu_ID'
        })
      );
      return;
    }

    if (
      name === undefined &&
      description === undefined &&
      price === undefined
    ) {
      res.status(400).send(
        JSON.stringify({
          message: 'no new information [name, description, price]'
        })
      );
      return;
    }

    const command =
      'UPDATE `MENU` SET ' +
      (name ? '`menu_name` = "' + name + '"' : '') +
      (description
        ? (name ? ', ' : ' ') + '`menu_description` = "' + description + '"'
        : '') +
      (price ? (name || description ? ', ' : ' ') + '`price` = ' + price : '') +
      ' WHERE `menu_ID` = ' +
      menu_ID;

    issue_command(res, command);
  });
};

/*
 * remove a menu
 * Request
 * {
 * 		menu_ID: 		// menu id
 * }
 * Response
 * {
 * 		message: 		// status message
 * }
 */
const remove = (req, res) => {
  login.checkManager(req, res, () => {
    const menu_ID = req.body.menu_ID;

    if (menu_ID === undefined) {
      res.status(400).send(
        JSON.stringify({
          message: 'no menu_ID'
        })
      );
      return;
    }

    const command = 'DELETE FROM `MENU` WHERE `menu_ID` = ' + menu_ID;

    issue_command(res, command);
  });
};

//////// UI ///////
// TODO
const ui = (req, res) => {
  res.sendFile('menu.html', {
    root: __dirname + '/../view'
  });
};

module.exports = {
  // menu JSON api
  read: read,
  create: create,
  update: update,
  remove: remove,

  // menu ui
  ui: ui
};
