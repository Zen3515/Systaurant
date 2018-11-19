const assert = require("assert");
const crypto = require("crypto");
const sha256 = require("sha256");

const mysql_connect = require("./connectDB.js");

const DB = "Systaurant";
const LOG_LEVEL = 1;

const account = [
	{
		fname:     'Phirasit', 
		lname:     'Charoenchitseriwong', 
		addr:      '59/7 ************ Ratchatewi Bangkok 10400', 
		phoneNO:   '0832894321', 
		gender:    0, 
		birthdate: '1998-05-16', 
		email:     'p********@gmail.com' 
	}, {
		fname:     'Troy', 
		lname:     'Kshlerin', 
		addr:      '9662 Kunde Mountain North Kaelatown 46180', 
		phoneNO:   '2036743628', 
		gender:    0, 
		birthdate: '1995-03-15', 
		email:     'chief_arizona@gmail.com' 
	}, {
		fname:     'Easton', 
		lname:     'Ward', 
		addr:      '63318 Lockman View North Rigoberto 72198', 
		phoneNO:   '8921768684', 
		gender:    0, 
		birthdate: '1995-03-15', 
		email:     'Uriah.Ullrich21@hotmail.com' 
	}, {
		fname:     'Thea', 
		lname:     'Botsford', 
		addr:      '65815 Hills Knoll Port Arch 26580-9775', 
		phoneNO:   '3529798454', 
		gender:    1, 
		birthdate: '1985-07-26', 
		email:     'Patience.Rolfson@gmail.com' 
	}, {
		fname:     'Cale', 
		lname:     'Kirlin', 
		addr:      '89130 O Keefe Shoals Daughertystad 79135', 
		phoneNO:   '6359719262', 
		gender:    1, 
		birthdate: '1989-11-11', 
		email:     'Brooke1@yahoo.com' 
	}, {
		fname:     'Ed', 
		lname:     'Murazik', 
		addr:      '7248 Wisozk Light East Danika 84791', 
		phoneNO:   '4813332980', 
		gender:    0, 
		birthdate: '1991-12-31', 
		email:     'Augustine_Lynch@hotmail.com' 
    },{
		fname:     'Cathrine', 
		lname:     'Osinski', 
		addr:      '76142 Abagail Squares West Jules 96256', 
		phoneNO:   '7261015918', 
		gender:    1, 
		birthdate: '1999-09-09', 
		email:     'Cathrine_Cassin46@yahoo.com' 
    },
];
const employee  = [
	{
		account_id: 0, 
		ssn:     '2334223424101', 
		salary:   75000, 
		workday:   63, 
		employee_type: 2 
    } ,{
		account_id: 1, 
		ssn:     '2334223424212', 
		salary:   30000, 
		workday:   63, 
		employee_type:  1
    },{
		account_id: 3, 
		ssn:     '2334223424323', 
		salary:   6500, 
		workday:   63, 
		employee_type: 0 
    },{
		account_id: 5, 
		ssn:     '2334223424434', 
		salary:   6000, 
		workday:   63, 
		employee_type: 0 
    }
];
const member = [2,4,7];  //not employees
const TableSize 		= [2, 3, 4, 5, 6, 7];
const menus = [
    { name: "Fried Chicken"        , desc: "Deep fried chicken wing"     , price: 270.00 },
    { name: "Beef Steak"           , desc: "Grounded beef pepper steak"  , price: 640.00 },
    { name: "Laab Tuna"            , desc: "Thai spicy tuna salad"       , price: 35.00  },
    { name: "Cabonara Spaghetti"   , desc: "Spaghetti with cabonara"     , price: 170.00 }
];

const numAccount 		= account.length;
const numMember 		= member.length;
const numEmployee 		= employee.length;
const numTable			= TableSize.length;
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

            const account_id        = employee[i].account_id;
            const ssn               = employee[i].ssn;
            const salary            = employee[i].salary;
            const workday           = employee[i].workday;
            const employee_type     = employee[i].employee_type;

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
        let employees = [];
        for (let i = 0; i < numEmployee; ++i) {
            if(employee[i].employee_type==0)  employees.push(i);
        }
        executeCommandSeq(db, employees.length, (i) => {
            const employee_id       = employees[i];
            const status            = employee_id % 2;

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
        let employees = [];
        for (let i = 0; i < numEmployee; ++i) {
            if(employee[i].employee_type==1)  employees.push(i);
        }
        executeCommandSeq(db, employees.length, (i) => {
            const employee_id       = employees[i];
                
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
        let employees = [];
        for (let i = 0; i < numEmployee; ++i) {
            if(employee[i].employee_type==2)  employees.push(i);
        }
        executeCommandSeq(db, employees.length, (i) => {
            const employee_id       = employees[i];
                
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
            const account_id        = member[i];
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

            const employee_ID           = 3;
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
            const employee_ID           = 3;
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

