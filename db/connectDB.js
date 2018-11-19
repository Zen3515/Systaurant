const mysql = require('mysql');

import config from './config';

module.exports = function(callback) {
  const db_con = mysql.createConnection(config);
  db_con.connect(err => {
    if (err) {
      console.log('error connecting db : ' + err);
    } else {
      callback(db_con);
    }
  });
};
