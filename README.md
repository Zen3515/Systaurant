# Systaurant

2110322 Database System final project using nodejs.

| Command                | Description                               |
| ---------------------- | ----------------------------------------- |
| `node run migrate`     | migrate a database. MySQL is required.    |
| `node run constraint`  | add constraints (trigger functions) to the database <br> (DB has to be migrated first). |
| `node run seed`        | seed the data.                            |
| `node start`           | start the server. (default port is 3000). |

Set-up config:

1. copy `config.template.js` and paste in same folder
2. rename the new `config.template.js` to `config.js`
