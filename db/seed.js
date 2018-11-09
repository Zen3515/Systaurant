const sha256 = require("sha256");
const crypto = require("crypto");

const mysql_connect = require("./connectDB.js");

const DB = "Systaurant";

const numAccount 		= 10;
const numMember 		= 5;
const numEmployee 		= 5;
const TableSize 		= [2, 3, 4, 5, 6, 7];
const numTable			= TableSize.length;
const numMenu 			= 5;
const numThumbnail		= 10;
const numPromo 			= 5;
const numSale 			= 5;

const tables = [
    "ACCOUNT", "EMPLOYEE", "EMPLOYEE_WAITER", "EMPLOYEE_CHEF", "EMPLOYEE_MANAGER",
    "MEMBER", "TABLE", "RESERVE", "MENU", "MENU_THUMBNAIL", "SALE", "RECEIPT", "RECOMMENDATION",
    "PROMOTION", "APPLY_PROMOTION", "ORDER"
];

const ignore = (err, _) => { if (err) console.log(err); };
const terminate = () => { process.exit(0); };

mysql_connect(function(db) {

    function selectDB(callback) {
        db.query("USE " + DB, () => callback());
    }

    function purgeTable(table, callback) {
        if (table.length > 0) {
            const t = table.pop();
            db.query(`DELETE FROM \`${t}\``, () => {
                db.query(`ALTER TABLE \`${t}\` AUTO_INCREMENT = 1`, (err) => {
                    if (err) console.log(err);
                    purgeTable(table, callback);
                });
            })
        } else {
            callback();
        }
    };

    // Generate ACCOUNT
    const seedAccount = (callback) => {
        const num = numAccount;
        function iterate(i) {
            if (i === num) {
                callback();
                return;
            }

            const salt = crypto.randomBytes(5).toString('hex');
            const pass = sha256(i.toString() + salt);

            const fname = `user${i}`;
            const lname = `lastname${i}`;
            const addr = `addraddraddr${i}`;
            const phoneNO = `08${i}${i}${i}99999`;
            const gender = i % 2;
            const birthdate = `2540-${i+1}-${i+1}`;
            const email = `email${i}@mail.com`;

            db.query("INSERT INTO `ACCOUNT` " +
                "(`password`, `salt`, `firstname`, `lastname`, `address`, `phone_NO`, `gender`, `birthdate`, `email`) " +
                " VALUES " +
                `(\"${pass}\", \"${salt}\", \"${fname}\", \"${lname}\", \"${addr}\", 
                ${phoneNO}, ${gender}, \"${birthdate}\", \"${email}\")`, () => iterate(i+1));
        };
        iterate(0);
    };

    // Generate EMPLOYEE
    const seedEmployee = (callback) => {
        const num = numEmployee;
        function iterate(i) {
            if (i === num) {
                callback();
                return;
            }

            const account_id = i + 1;
            const ssn = `2334223424${i+1}${i}${i+1}`;
            const salary = 5000 + 1000 * i;
            const workday = 63;
            const employee_type = (i >= (numEmployee + 2) / 3) + (i >= (numEmployee + 2) / 3 + (numEmployee + 1) / 3);

            db.query("INSERT INTO `EMPLOYEE` " +
                "(`account_ID`, `SSN`, `salary`, `workday`, `employee_type`) " +
                " VALUES " +
                `(${account_id}, \"${ssn}\", \"${salary}\", \"${workday}\", \"${employee_type}\")`, () => iterate(i+1));
        }
        iterate(0);
    };

    // Generate EMPLOYEE_WAITER
    const seedEmployeeWaiter = (callback) => {
        const num = ~~( (numEmployee + 2) / 3 );
        const idx = 0;
        function iterate(i) {
            if (i === idx + num) {
                callback();
                return;
            }
            const employee_id = i + 1;
            const status = i % 2;
            db.query("INSERT INTO `EMPLOYEE_WAITER` " +
                "(`employee_ID`, `status`) " +
                " VALUES " +
                `(${employee_id}, \"${status}\")`, () => iterate(i+1));
        }
        iterate(idx);
    };

    // Generate EMPLOYEE_CHEF
    const seedEmployeeChef = (callback) => {
        const num = ~~( (numEmployee + 1) / 3 );
        const idx = ~~( (numEmployee + 2) / 3 );
        function iterate(i) {
            if (i === idx + num) {
                callback();
                return;
            }
            const employee_id = i + 1;
            db.query("INSERT INTO `EMPLOYEE_CHEF` " +
                "(`employee_ID`) " +
                " VALUES " +
                `(${employee_id})`, () => iterate(i+1));
        }
        iterate(idx);
    };

    // Generate EMPLOYEE_MANAGER
    const seedEmployeeManager = (callback) => {
        const num = ~~( numEmployee / 3 );
        const idx = numEmployee - num;
        function iterate(i) {
            if (i === idx + num) {
                callback();
                return;
            }
            const employee_id = i + 1;
            db.query("INSERT INTO `EMPLOYEE_MANAGER` " +
                "(`employee_ID`) " +
                " VALUES " +
                `(${employee_id})`, () => iterate(i+1));
        }
        iterate(idx);
    };

    // Generate Member
    const seedMember = (callback) => {
        const num = numMember;
        const idx = numEmployee;
        function iterate(i) {
            if (i === idx + num) {
                callback();
                return;
            }
            const account_id = i + 1;
            const registered_date = `2012-03-${i+1} 0:${i+3}:0`;

            db.query("INSERT INTO `MEMBER` " +
                "(`account_ID`, `registered_date`) " +
                " VALUES " +
                `(${account_id}, \"${registered_date}\")`, () => iterate(i+1));
        }
        iterate(idx);
    };

	// Generate Table
    const seedTable = (callback) => {
        const num = numTable;
        const idx = 0;
        function iterate(i) {
            if (i === idx + num) {
                callback();
                return;
            }
            const status = 0;
            const seat_num = TableSize[i];

            db.query("INSERT INTO `TABLE` " +
                "(`status`, `number_of_seats`) " +
                " VALUES " +
                `(${status}, \"${seat_num}\")`, () => iterate(i+1));
        }
        iterate(idx);
    };
	
	// Generate Menu
    const seedMenu = (callback) => {
        const num = numMenu;
        const idx = 0;
        function iterate(i) {
            if (i === idx + num) {
                callback();
                return;
            }
            db.query("INSERT INTO `MENU` " +
                "(`menu_name`, `menu_description`, `price`)" +
                " VALUES " +
                `(\"menu${i}\", \"menu description: this menu sucks\", ${234.23 + 502 * i})`, () => iterate(i+1));
        }
        iterate(idx);
    };

    // Generate Thumbnail
    const seedThumbnail = (callback) => {
        const num = numThumbnail;
        const idx = 0;
        function iterate(i) {
            if (i === idx + num) {
                callback();
                return;
            }
            db.query("INSERT INTO `MENU_THUMBNAIL` " +
                "(`menu_ID`, `menu_thumbnail`)" +
                " VALUES " +
                `(${i%numMenu+1}, \"imgs/img${i}.jpg\"})`, () => iterate(i+1));
        }
        iterate(idx);
    };

	// Generate Promotion
    const seedPromo = (callback) => {
        const num = numPromo;
        const idx = 0;
        function iterate(i) {
            if (i === idx + num) {
                callback();
                return;
            }
            db.query("INSERT INTO `PROMOTION` " +
                "(`employee_ID`, `pro_start_date`, `pro_expire_date`, `criteria`, `discount_percent`)" +
                " VALUES " +
                `(1, \"2012-${i+1}-${i+7}\", \"2012-${12-i}-${i+2}\", \"CRITERIA${i}\", ${10.23 + 5 * i})`, () => iterate(i+1));
        }
        iterate(idx);
    };

	// Generate Sale
    const seedSale = (callback) => {
        const num = numSale;
        const idx = 0;
        function iterate(i) {
            if (i === idx + num) {
                callback();
                return;
            }
            db.query("INSERT INTO `SALE` " +
                "(`sale_start_date`, `sale_start_date`, `employee_ID`, `discount`)" +
                " VALUES " +
                `(1, \"2002-${i+3}-${i+10}\", \"2032-${11-i}-${30-i}\", \"CRITERIA${i}\", ${43.34 + 6 * i})`, () => iterate(i+1));
        }
        iterate(idx);
    };

	// Generate Order
    const seedOrder = (callback) => {
        const num = numSale;
        const idx = 0;
        function iterate(i) {
            if (i === idx + num) {
                callback();
                return;
            }
            db.query("INSERT INTO `ORDER` " +
                "(`menu_ID`, `table_ID`, `order_time`, `status`)" +
                " VALUES " +
                `(\"${i%numMenu+1}\", \"${(i*i)%numTable+1}\", \"2031-${10-i}-${23-i}\", 0)`, () => iterate(i+1));
        }
        iterate(idx);
    };

    const checkMember = (callback) => {
        db.query("SELECT * FROM `ACCOUNT` a, `MEMBER` e WHERE a.`account_ID` = e.`account_ID`", (err, result) => {
            if (err) console.log(err);
            console.log(result)
            callback();
        });
    };

    const checkTable = (callback) => {
        db.query("SELECT * FROM `TABLE`", (err, result) => {
            if (err) console.log(err);
            console.log(result)
            callback();
        });
    };

    // Executing async processes synchronously
    function executeAsync(order) {
        if (order.length === 0) {
            return () => {};
        }
        const f = order.shift();
        console.log(f);
        return () => f(executeAsync(order));
    }

    // List of executing functions in order
    executeAsync([
        selectDB,
        function resetDB (callback) { purgeTable(tables, callback) },
        seedAccount,
        seedEmployee,
        seedEmployeeWaiter,
        seedEmployeeChef,
        seedEmployeeManager,
        seedMember,
        seedTable,
        seedMenu,
        seedThumbnail,
        seedPromo,
        seedSale,
        seedOrder,
        // checkMember,
        // checkTable,
        terminate,
    ])();
});

