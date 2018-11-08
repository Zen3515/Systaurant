const mysql_connect = require("./connectDB.js");
const fs = require("fs");

const install_script_filename = "db/schema.sql";

fs.readFile(install_script_filename, 'utf-8', function(err, install_script) {
    if (err) {
        console.log("error opening " + install_script_filename + " : " + err);
        throw err;
    } else {
        mysql_connect(false, function(db) {
            console.log(install_script);
            db.query(install_script, function (err, result) {
                console.log(err ? err : result);
                process.exit(0);
            });
        });
    }
});
