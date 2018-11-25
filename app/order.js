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
 * return a list of orders
 * Request { // none }
 * Response
 * {
 *      message:      // status message
 *      order:        // list of orders
 * }
 */
const read = (req, res) => {

    const id = req.session.table;

    const command = "SELECT" 
        + " ord.`order_ID`, ord.`employee_ID`, ord.`status`, menu.`menu_name`, menu.`price`"
        + " FROM `ORDER` ord," 
        + " (SELECT m.`menu_ID`, m.`menu_name`, m.`menu_description`"
        +  ", ROUND(IFNULL(m.`price` * (100 - s.`discount`) / 100, m.`price`), 2) AS price"
        +  " FROM MENU m"
        +   " LEFT JOIN (SELECT `menu_ID`, MAX(discount) AS discount FROM SALE GROUP BY menu_ID) s"
        +  " ON m.`menu_ID` = s.`menu_ID`) menu"
        + " WHERE ord.`table_ID` = " + id
        + " AND ord.`receipt_ID` IS NULL"
        + " AND ord.`menu_ID` = menu.`menu_ID`";

    mysql_connect((db) => {
        db.query(command, (err, result) => {
            if (err) {
                res.status(400).send(JSON.stringify({
                    message: err,
                }));
            } else {
                res.send(JSON.stringify({
                    message: "OK",
                    order: result
                }));
            }
        });
    });
}

/*
 * return a list of orders in the receipt
 * Request { // none }
 * Response
 * {
 *      message:     // status message
 *      order:       // list of orders
 * }
 */
const readReceipt = (req, res) => {

    const receipt_ID = req.session.receipt;

    const command = "SELECT" 
        + " ord.`order_ID`, ord.`status`, menu.`menu_name`, menu.`price`"
        + " FROM `ORDER` ord,"
        + " (SELECT m.menu_ID, m.menu_name, m.menu_description"
        +    ", ROUND(IFNULL(m.price * (100 - s.discount) / 100, m.price), 2) AS price"
        +    " FROM MENU m"
        +    " LEFT JOIN (SELECT menu_ID, MAX(discount) AS discount FROM `SALE` GROUP BY menu_ID) s"
        +    " ON m.menu_ID = s.menu_ID"
        + " ) menu"
        + " WHERE ord.`receipt_ID` = " + receipt_ID
        + " AND ord.`menu_ID` = menu.`menu_ID`";

    mysql_connect((db) => {
        db.query(command, (err, result) => {

            if (err) {
                res.status(400).send(JSON.stringify({
                    message: err,
                }));
            } else {
                res.send(JSON.stringify({
                    message: "OK",
                    order: result
                }));
            }
        });
    });
}

/*
 * create an order
 * Request
 * {
 *     menu_ID:     // menu id  
 * }
 * Response
 * {
 *     message:     // status message
 * }
 */
const create = (req, res) => {

    const menu_ID     = req.body.menu_ID;
    const table_ID     = req.session.table;

    if (menu_ID === undefined || table_ID === undefined) {
        res.status(400).send(JSON.stringify({
            message: "information is missing [menu_ID, table_ID]",
        }));
        return;
    }

    const command = "INSERT INTO `ORDER` "
        + "(`menu_ID`, `table_ID`)"
        + "VALUES (" + menu_ID + ", " + table_ID + ")";

    issue_command(res, command);
};

/*
 * accept an order
 * can be done by only employee if and only if the employee_ID is NULL
 * Request
 * {
 *     order_ID:   // order id
 * }
 * Response
 * {
 *     message:   // status message
 * }
 */
const accept = (req, res) => {

    const order_ID     = req.body.order_ID;
    const employee_ID  = req.session.user.id;

    if (order_ID === undefined) {
        res.status(400).send(JSON.stringify({
            message: "information is missing [order_ID]",
        }));
        return;
    }

    const command = "UPDATE `ORDER`"
        + " SET employee_ID = " + employee_ID
        + " WHERE order_ID = " + order_ID 
        + " AND employee_ID IS NULL";

    issue_command(res, command);
};

/*
 * decline an order
 * can be done by only employee if and only if the employee_ID is NULL
 * Request
 * {
 *      order_ID:   // order id
 * }
 * Response
 * {
 *      message:    // status message
 * }
 */
const decline = (req, res) => {

    const order_ID     = req.body.order_ID;
    const employee_ID  = req.session.user.id;

    if (order_ID === undefined) {
        res.status(400).send(JSON.stringify({
            message: "information is missing [order_ID]",
        }));
        return;
    }

    const command = "UPDATE `ORDER`"
        + " SET employee_ID = NULL"
        + " WHERE order_ID = " + order_ID
        + " AND employee_ID = " + employee_ID;

    issue_command(res, command);
};

/*
 * finish an order
 * when the order is finished
 * Request
 * {
 *      order_ID:   // order id
 * }
 * Response
 * {
 *      message:    // status message
 * }
 */
const done = (req, res) => {

    const order_ID     = req.body.order_ID;
    const employee_ID  = req.session.user.id;

    if (order_ID === undefined) {
        res.status(400).send(JSON.stringify({
            message: "information is missing [order_ID]",
        }));
        return;
    }

    const command = "UPDATE `ORDER`"
        + " SET status = 1"
        + " WHERE order_ID = " + order_ID
        + " AND employee_ID = " + employee_ID
        + " AND status = 0";

    issue_command(res, command);
};

/*
 * get an order
 * when the order is served
 * Request
 * {
 *      order_ID:   // order id
 * }
 * Response
 * {
 *      message:    // status message
 * }
 */
const receive = (req, res) => {

    const order_ID     = req.body.order_ID;
    const employee_ID  = req.session.user.id;

    if (order_ID === undefined) {
        res.status(400).send(JSON.stringify({
            message: "information is missing [order_ID]",
        }));
        return;
    }

    const command = "UPDATE `ORDER`"
        + " SET status = 2"
        + " WHERE order_ID = " + order_ID
        + " AND status = 1";

    issue_command(res, command);
};

/*
 * cancel an order
 * can be done if and only if the employee_ID is NULL
 * Request
 * {
 *      order_ID:   // order id
 * }
 * Response
 * {
 *      message:    // status message
 * }
 */
const cancel = (req, res) => {

    const order_ID = req.body.order_ID;
    const table_ID = req.session.table;

    if (order_ID === undefined) {
        res.status(400).send(JSON.stringify({
            message: "no order_ID",
        }));
        return;
    }

    const command = "DELETE FROM `ORDER` "
        + " WHERE `order_ID` = " + order_ID
        + " AND `table_ID` = "   + table_ID 
        + " AND `employee_ID` IS NULL";

    issue_command(res, command);
};

/*
 * list all cooking orders
 * Request {}
 * Response
 * {
 *      message:    // status message
 *      yours:      // list of the orders that are yours
 *      untaken:    // list of the orders that are still untaken
 * }
 */
const cooklist = (req, res) => {

    const employee_ID = req.session.user.id;

    const isYours = (rec) => { return rec.employee_ID == employee_ID; };
    const isNull = (rec) => { return !isYours(rec); };

    const command = "SELECT ord.order_ID, ord.employee_ID, ord.table_ID, menu.menu_name FROM `ORDER` ord, `MENU` menu "
        + " WHERE (ord.`employee_ID` IS NULL"
        + " OR ord.`employee_ID` = " + employee_ID + ")"
        + " AND menu.`menu_ID` = ord.`menu_ID`"
        + " AND ord.`status` = 0;";

    mysql_connect(db => {
        db.query(command, (err, result) => {
            if (err) {
                res.status(400).send(JSON.stringify({
                    message: err,
                    yours: {},
                    untaken: {},
                }));
            } else {
                res.send(JSON.stringify({
                    message: "OK",
                    yours: result.filter(isYours),
                    untaken: result.filter(isNull),
                }));
            }
        });
    });
};

/*
 * list all waiting orders
 * Request {}
 * Response
 * {
 *      message:    // status message
 *      list:       // list of the orders that are yours
 * }
 */
const waitlist = (req, res) => {

    const command = "SELECT ord.order_ID, ord.employee_ID, ord.table_ID, menu.menu_name "
        + " FROM `ORDER` ord, `MENU` menu "
        + " WHERE menu.`menu_ID` = ord.`menu_ID`"
        + " AND ord.`status` = 1;";

    mysql_connect(db => {
        db.query(command, (err, result) => {
            if (err) {
                res.status(400).send(JSON.stringify({
                    message: err,
                    list: {},
                }));
            } else {
                res.send(JSON.stringify({
                    message: "OK",
                    list: result, 
                }));
            }
        });
    });
};

//////// UI ///////
const ui = (req, res) => { res.sendFile("order.html", {
    root: __dirname  + '/../view'
}); };

const cooklist_ui = (req, res) => { res.sendFile("cooklist.html", {
    root: __dirname + '/../view'
}); };

const waitlist_ui = (req, res) => { res.sendFile("waitlist.html", {
    root: __dirname + '/../view'
}); };


module.exports = {

    // order JSON api
    read:         read,
    readReceipt:  readReceipt,
    create:       create,
    cancel:       cancel,
    accept:       accept,
    decline:      decline,
    done:         done,
    receive:      receive,

    cooklist:     cooklist,
    waitlist:     waitlist,

    // order ui
    ui:           ui,
    cooklist_ui:  cooklist_ui,
    waitlist_ui:  waitlist_ui,
};
