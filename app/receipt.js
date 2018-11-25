/*
 * receipt.js
 * use for managing everything releated to billing and receipts
 */

const login         = require("./login.js");
const mysql_connect = require("../db/connectDB.js");

//////// API //////

/*
 * create a receipt
 * Request
 * {}
 * Response
 * {
 *      message:        // status message
 *      receipt_ID:     // id of the create receipt
 * }
 */
const create = (req, res) => {

    const table_ID = req.session.table;

    mysql_connect((db) => {

        const command = `CALL CREATE_RECEIPT(${table_ID});`;
        console.log(command);

        db.query(command, (err, result) => {

            if (err) {
                console.log(err);
                res.status(400).send(JSON.stringify({
                    message: err,
                }));
                return; 
            }

            db.query("SELECT LAST_INSERT_ID() AS ID;", (err, result) => {

                if (err) {
                    console.log(err);
                    res.status(400).send(JSON.stringify({
                        message: err,
                    }));
                    return; 
                }

                req.session.receipt = result[0].ID;

                res.send(JSON.stringify({
                    message: "OK",
                    receipt_ID: result[0].ID
                }));
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
 *      message:    // status message
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
