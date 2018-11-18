const sha256 = require("sha256");
const crypto = require("crypto");

const mysql_connect = require("./connectDB.js");

const DB = "Systaurant";
const LOG_LEVEL = 1;

const account = [
	{
		fname:     'Phirasit', 
		lname:     'Charoenchitseriwong', 
		addr:      '59/7 soi Kolit Phayathai Rd. Ratchatewi Bangkok 10400', 
		phoneNO:   '0811781888', 
		gender:    0, 
		birthdate: '1998-02-12', 
		email:     'phirasitsharp@gmail.com' 
	}, {
		fname:     'Phirasit', 
		lname:     'Charoenchitseriwong', 
		addr:      '59/7 soi Kolit Phayathai Rd. Ratchatewi Bangkok 10400', 
		phoneNO:   '0811781888', 
		gender:    0, 
		birthdate: '1998-02-12', 
		email:     'phirasitsharp@gmail.com' 
	}, {
		fname:     'Phirasit', 
		lname:     'Charoenchitseriwong', 
		addr:      '59/7 soi Kolit Phayathai Rd. Ratchatewi Bangkok 10400', 
		phoneNO:   '0811781888', 
		gender:    0, 
		birthdate: '1998-02-12', 
		email:     'phirasitsharp@gmail.com' 
	}, {
		fname:     'Phirasit', 
		lname:     'Charoenchitseriwong', 
		addr:      '59/7 soi Kolit Phayathai Rd. Ratchatewi Bangkok 10400', 
		phoneNO:   '0811781888', 
		gender:    0, 
		birthdate: '1998-02-12', 
		email:     'phirasitsharp@gmail.com' 
	}, {
		fname:     'Phirasit', 
		lname:     'Charoenchitseriwong', 
		addr:      '59/7 soi Kolit Phayathai Rd. Ratchatewi Bangkok 10400', 
		phoneNO:   '0811781888', 
		gender:    0, 
		birthdate: '1998-02-12', 
		email:     'phirasitsharp@gmail.com' 
	}, {
		fname:     'Phirasit', 
		lname:     'Charoenchitseriwong', 
		addr:      '59/7 soi Kolit Phayathai Rd. Ratchatewi Bangkok 10400', 
		phoneNO:   '0811781888', 
		gender:    0, 
		birthdate: '1998-02-12', 
		email:     'phirasitsharp@gmail.com' 
	},
];

const numAccount 		= account.length;
const numMember 		= 3;
const numEmployee 		= 3;
const TableSize 		= [2, 3, 4, 5, 6, 7];
const numTable			= TableSize.length;

const menus = [
	{ name: "Fried Chicken"        , desc: "Deep fried chicken wing"     , price: 270.00 },
	{ name: "Beef Steak"           , desc: "Grounded beef pepper steak"  , price: 640.00 },
	{ name: "Laab Tuna"            , desc: "Thai spicy tuna salad"       , price: 35.00  },
	{ name: "Cabonara Spaghetti"   , desc: "Spaghetti with cabonara"     , price: 170.00 }
];

const numMenu 			= menus.length;
const numThumbnail		= 10;
const numPromo 			= 5;
const numSale 			= 5;
const numOrder          = 10;

const tables = [
    "ACCOUNT", "EMPLOYEE", "EMPLOYEE_WAITER", "EMPLOYEE_CHEF", "EMPLOYEE_MANAGER",
    "MEMBER", "TABLE", "RESERVE", "MENU", "MENU_THUMBNAIL", "SALE", "RECEIPT", "RECOMMENDATION",
    "PROMOTION", "APPLY_PROMOTION", "ORDER"
];

const terminate = () => { process.exit(0); };

const createCallback = (callback, showError, showResult) => {
    return (err, result) => {
        if (showError && err) { console.log(err); terminate(); }
        if (showResult) console.log(result);
        callback();
    }
};

// Executing async processes synchronously
function createExecuteAsync(order, log_level) {
    if (order.length === 0) {
        return () => {};
    }
    const f = order.shift();
    if (log_level <= LOG_LEVEL) console.log(log_level, f);
    return () => f(createExecuteAsync(order, log_level));
}

function executeCommandSeq(db, n, func, callback) {
    let command = [];
    for (let i = 0; i < n; ++i) {
        command.push(func(i));
    }
    command.push(callback);
    createExecuteAsync(command, 2)();
}
////// SEEDING PROCESS ////////
mysql_connect(function(db) {

    function selectDB(callback) {
        db.query("USE " + DB, () => callback());
    }

    function purgeTable(table, callback) {
        if (table.length > 0) {
            const t = table.pop();
            db.query(`DELETE FROM \`${t}\``, () => {
                db.query(
                    `ALTER TABLE \`${t}\` AUTO_INCREMENT = 1`
                    , createCallback(() => { purgeTable(table, callback); }, true, false)
                );
            })
        } else {
            callback();
        }
    };

    // Generate ACCOUNT
    const seedAccount = (callback) => {

        executeCommandSeq(db, numAccount, (i) => {

            const fname         = account[i].fname;
            const lname         = account[i].lname;
            const addr          = account[i].addr;
            const phoneNO       = account[i].phoneNO;
            const gender        = account[i].gender;
            const birthdate     = account[i].birthdate;
            const email         = account[i].email;

            const salt = crypto.randomBytes(5).toString('hex');
            const pass = sha256("pass" + salt);

            return (callback) => {
                db.query("INSERT INTO `ACCOUNT` " +
                    "(`password`, `salt`, `firstname`, `lastname`, `address`, `phone_NO`, `gender`, `birthdate`, `email`) " +
                    " VALUES " +
                    `(\"${pass}\", \"${salt}\", \"${fname}\", \"${lname}\", \"${addr}\", \"${phoneNO}\", ${gender}, \"${birthdate}\", \"${email}\")`
                    , createCallback(callback, true, false));
            };
        }, callback);
    };

    // Generate EMPLOYEE
    const seedEmployee = (callback) => {

        executeCommandSeq(db, numEmployee, (i) => {

            const account_id        = i + 1;
            const ssn               = `2334223424${i+1}${i}${i+1}`;
            const salary            = 5000 + 1000 * i;
            const workday           = 63;
            const employee_type     =
                (i >= Math.floor((numEmployee + 2) / 3)) +
                (i >= Math.floor((numEmployee + 2) / 3) + Math.floor((numEmployee + 1) / 3));

            return (callback) => {
                db.query("INSERT INTO `EMPLOYEE` " +
                    "(`account_ID`, `SSN`, `salary`, `workday`, `employee_type`) " +
                    " VALUES " +
                    `(${account_id}, \"${ssn}\", \"${salary}\", \"${workday}\", \"${employee_type}\")`
                    , createCallback(callback, true, false));
            };
        }, callback);
    };

    // Generate EMPLOYEE_WAITER
    const seedEmployeeWaiter = (callback) => {
        executeCommandSeq(db, Math.floor((numEmployee + 2) / 3), (i) => {

            const employee_id       = i + 1;
            const status            = i % 2;

            return (callback) => {
                db.query("INSERT INTO `EMPLOYEE_WAITER` " +
                    "(`employee_ID`, `status`) " +
                    " VALUES " +
                    `(${employee_id}, \"${status}\")`
                    , createCallback(callback, true, false));
            };
        }, callback);
    };

    // Generate EMPLOYEE_CHEF
    const seedEmployeeChef = (callback) => {

        executeCommandSeq(db, Math.floor( (numEmployee + 1) / 3), (i) => {

            i += Math.floor( (numEmployee + 2) / 3);
            const employee_id       = i + 1;

            return (callback) => {
                db.query("INSERT INTO `EMPLOYEE_CHEF` " +
                    "(`employee_ID`) " +
                    " VALUES " +
                    `(${employee_id})`
                    , createCallback(callback, true, false));
            };
        }, callback);
    };

    // Generate EMPLOYEE_MANAGER
    const seedEmployeeManager = (callback) => {

        executeCommandSeq(db, Math.floor( numEmployee / 3), (i) => {

            i += numEmployee - Math.floor( numEmployee / 3);
            const employee_id       = i + 1;

            return (callback) => {
                db.query("INSERT INTO `EMPLOYEE_MANAGER` " +
                    "(`employee_ID`) " +
                    " VALUES " +
                    `(${employee_id})`
                    , createCallback(callback, true, false));
            };
        }, callback);
    };

    // Generate Member
    const seedMember = (callback) => {

        executeCommandSeq(db, numMember, (i) => {

            i += numEmployee;
            const account_id        = i + 1;
            const registered_date   = `2012-03-${i+1} 0:${i+3}:0`;

            return (callback) => {
                db.query("INSERT INTO `MEMBER` " +
                    "(`account_ID`, `registered_date`) " +
                    " VALUES " +
                    `(${account_id}, \"${registered_date}\")`
                    , createCallback(callback, true, false));
            };
        }, callback);
    };

	// Generate Table
    const seedTable = (callback) => {

        executeCommandSeq(db, numTable, (i) => {
            const seat_num      = TableSize[i];

            return (callback) => {
                db.query("INSERT INTO `TABLE` " +
                    "(`number_of_seats`) " +
                    " VALUES " +
                    `(\"${seat_num}\")`
                    , createCallback(callback, true, false));
            };
        }, callback);
    };
	
	// Generate Menu
    const seedMenu = (callback) => {

        executeCommandSeq(db, numMenu, (i) => {

            const menu_name         = menus[i].name;
            const menu_description  = menus[i].desc;
            const price             = menus[i].price;

            return (callback) => {
                db.query("INSERT INTO `MENU` " +
                    "(`menu_name`, `menu_description`, `price`)" +
                    " VALUES " +
                    `(\"${menu_name}\", \"${menu_description}\", ${price})`
                    , createCallback(callback, true, false));
            };
        }, callback);
    };

    // Generate Thumbnail
    const seedThumbnail = (callback) => {

        executeCommandSeq(db, numThumbnail, (i) => {

            const menu_ID           = i % numMenu + 1;
            const menu_thumbnail    = `img${i}.jpg`;

            return (callback) => {
                db.query("INSERT INTO `MENU_THUMBNAIL` " +
                    "(`menu_ID`, `menu_thumbnail`)" +
                    " VALUES " +
                    `(${menu_ID}, \"${menu_thumbnail}\")`
                    , createCallback(callback, true, false));
            };
        }, callback);
    };

	// Generate Promotion
    const seedPromo = (callback) => {

        executeCommandSeq(db, numPromo, (i) => {

            const employee_ID           = 1;
            const pro_start_date        = `2012-${i+1}-${i+7}`;
            const pro_expire_date       = `2012-${12-i}-${i+2}`;
            const criteria              = `You have to pay full before using promo ${i}`;
            const discount_percent      = 10.23 + 5 * i;

            return (callback) => {
                db.query("INSERT INTO `PROMOTION` " +
                    "(`employee_ID`, `pro_start_date`, `pro_expire_date`, `criteria`, `discount_percent`)" +
                    " VALUES " +
                    `(${employee_ID}, \"${pro_start_date}\", \"${pro_expire_date}\", \"${criteria}\", ${discount_percent})`
                    , createCallback(callback, true, false));
            };
        }, callback);
    };

	// Generate Sale
    const seedSale = (callback) => {

        executeCommandSeq(db, numSale, (i) => {

            const menu_ID               = (i * i) % numMenu + 1;
            const sale_start_date       = `2002-${i+3}-${i+10}`;
            const sale_expire_date      = `2032-${11-i}-${30-i}`;
            const employee_ID           = 1;
            const discount              = 20 + i * 5.23;

            return (callback) => {
                db.query("INSERT INTO `SALE` " +
                    "(`menu_ID`, `sale_start_date`, `sale_expire_date`, `employee_ID`, `discount`)" +
                    " VALUES " +
                    `(${menu_ID}, \"${sale_start_date}\", \"${sale_expire_date}\", ${employee_ID}, ${discount})`
                    , createCallback(callback, true, false));
            };
        }, callback);
    };

	// Generate Order
    const seedOrder = (callback) => {

        executeCommandSeq(db, numOrder, (i) => {

            const menu_ID       = i % numMenu + 1;
            const table_ID      = (i * i) % numTable + 1;

            return (callback) => {
                db.query("INSERT INTO `ORDER` " +
                    "(`menu_ID`, `table_ID`)" +
                    " VALUES " +
                    `(\"${menu_ID}\", \"${table_ID}\")`
                    , createCallback(callback, true, false));
            };
        }, callback);
    };

    const checkMember = (callback) => {
        db.query("SELECT * FROM `ACCOUNT` a, `MEMBER` e WHERE a.`account_ID` = e.`account_ID`", (err, result) => {
            if (err) console.log(err);
            console.log(result);
            callback();
        });
    };

    const checkTable = (callback) => {
        db.query("SELECT * FROM `TABLE`", (err, result) => {
            if (err) console.log(err);
            console.log(result);
            callback();
        });
    };

    // List of executing functions in order
    createExecuteAsync([
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
    ], 1)();
});

