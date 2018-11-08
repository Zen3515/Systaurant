const mysql = require("mysql");

module.exports = function (withDatabase, callback) {

    let config = {
        host: "localhost",
        user: "root",
        password: "root",
    };

    if (withDatabase) {
        config.database = "Systaurant";
    }

    const db_con = mysql.createConnection(config);
    db_con.connect((err) => {
        if (err) {
            console.log("error connecting db : " + err);
        } else {
            callback(db_con);
        }
    });
};

