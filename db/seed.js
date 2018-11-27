const assert = require('assert');
const crypto = require('crypto');
const sha256 = require('sha256');

const mysql_connect = require('./connectDB.js');

const DB = 'Systaurant';
const LOG_LEVEL = 1;

const account = [
  {
    fname: 'Phirasit',
    lname: 'Charoenchitseriwong',
    addr: '59/7 ************ Ratchatewi Bangkok 10400',
    phoneNO: '0832894321',
    gender: 0,
    birthdate: '1998-05-16',
    email: 'p********@gmail.com'
  },
  {
    fname: 'Troy',
    lname: 'Kshlerin',
    addr: '9662 Kunde Mountain North Kaelatown 46180',
    phoneNO: '0203674362',
    gender: 0,
    birthdate: '1995-03-15',
    email: 'chief_arizona@gmail.com'
  },
  {
    fname: 'Easton',
    lname: 'Ward',
    addr: '63318 Lockman View North Rigoberto 72198',
    phoneNO: '0892176868',
    gender: 0,
    birthdate: '1995-03-15',
    email: 'Uriah.Ullrich21@hotmail.com'
  },
  {
    fname: 'Thea',
    lname: 'Botsford',
    addr: '65815 Hills Knoll Port Arch 26580-9775',
    phoneNO: '0352979845',
    gender: 1,
    birthdate: '1985-07-26',
    email: 'Patience.Rolfson@gmail.com'
  },
  {
    fname: 'Cale',
    lname: 'Kirlin',
    addr: '89130 O Keefe Shoals Daughertystad 79135',
    phoneNO: '0635971926',
    gender: 1,
    birthdate: '1989-11-11',
    email: 'Brooke1@yahoo.com'
  },
  {
    fname: 'Ed',
    lname: 'Murazik',
    addr: '7248 Wisozk Light East Danika 84791',
    phoneNO: '0481333298',
    gender: 0,
    birthdate: '1991-12-31',
    email: 'Augustine_Lynch@hotmail.com'
  },
  {
    fname: 'Cathrine',
    lname: 'Osinski',
    addr: '76142 Abagail Squares West Jules 96256',
    phoneNO: '0726101591',
    gender: 1,
    birthdate: '1999-09-09',
    email: 'Cathrine_Cassin46@yahoo.com'
  },
  {
    fname: 'Jone',
    lname: 'Doe',
    addr: '76142 Abagail Squares West Jules 92341',
    phoneNO: '0892384321',
    gender: 0,
    birthdate: '1998-10-12',
    email: 'JoneDoe@gmail.com'
  },
  {
    fname: 'Jane',
    lname: 'Doe',
    addr: '9662 hello Mountain North Kaelatown 46180',
    phoneNO: '0234322012',
    gender: 0,
    birthdate: '1985-03-15',
    email: 'JaneDoe@yahoo.com'
  },
  {
    fname: 'Easton',
    lname: 'Ward',
    addr: '63318 Lockman View North Rigoberto 72198',
    phoneNO: '0892176868',
    gender: 0,
    birthdate: '1995-03-15',
    email: 'Uriah.Ullrich21@hotmail.com'
  },
  {
    fname: 'Thea',
    lname: 'Botsford',
    addr: '65815 Hills Knoll Port Arch 26580-9775',
    phoneNO: '0352979845',
    gender: 1,
    birthdate: '1985-07-26',
    email: 'Patience.Rolfson@gmail.com'
  },
  {
    fname: 'Cale',
    lname: 'Kirlin',
    addr: '89130 O Keefe Shoals Daughertystad 79135',
    phoneNO: '0635971926',
    gender: 1,
    birthdate: '1989-11-11',
    email: 'Brooke1@yahoo.com'
  },
  {
    fname: 'Ed',
    lname: 'Murazik',
    addr: '7248 Wisozk Light East Danika 84791',
    phoneNO: '0481333298',
    gender: 0,
    birthdate: '1991-12-31',
    email: 'Augustine_Lynch@hotmail.com'
  },
  {
    fname: 'Cathrine',
    lname: 'Osinski',
    addr: '76142 Abagail Squares West Jules 96256',
    phoneNO: '0726101591',
    gender: 1,
    birthdate: '1999-09-09',
    email: 'Cathrine_Cassin46@yahoo.com'
  }
];
const employee = [
  {
    account_id: 1,
    ssn: '2334223424101',
    salary: 75000,
    workday: 63,
    employee_type: 2
  },
  {
    account_id: 2,
    ssn: '2334223424212',
    salary: 30000,
    workday: 63,
    employee_type: 1
  },
  {
    account_id: 4,
    ssn: '2334223424323',
    salary: 6500,
    workday: 63,
    employee_type: 0
  },
  {
    account_id: 6,
    ssn: '2323932120434',
    salary: 6000,
    workday: 63,
    employee_type: 0
  },
  {
    account_id: 7,
    ssn: '2239230120004',
    salary: 6000,
    workday: 63,
    employee_type: 2
  },
  {
    account_id: 8,
    ssn: '2999982323034',
    salary: 6000,
    workday: 63,
    employee_type: 0
  }
];

const member = [2, 4, 7]; //not employees
const TableSize = [2, 3, 4, 5, 6, 7];

const menus = [
  { name: 'Fried Chicken', desc: 'Deep fried chicken wing', price: 270.0 },
  { name: 'Beef Steak', desc: 'Grounded beef pepper steak', price: 640.0 },
  { name: 'Laab Tuna', desc: 'Thai spicy tuna salad', price: 35.0 },
  { name: 'Cabonara Spaghetti', desc: 'Spaghetti with cabonara', price: 170.0 },
  { name: 'Thai Salad', desc: 'Deep fried chicken wing', price: 30.0 },
  { name: 'Fish Steak', desc: 'steak', price: 640.0 },
  { name: 'Water', desc: 'plain tap water', price: 10.0 },
  { name: 'Expensive Spaghetti', desc: 'Spaghetti with cabonara', price: 1000.0 }
];

const orders = [
  {
    receipt_ID: 1,
    employee_ID: 3,
    table_ID: 1,
    menu_ID: 1,
    order_time: '2018-11-19 12:12:12',
    status: 3
  },
  {
    receipt_ID: 1,
    employee_ID: 3,
    table_ID: 1,
    menu_ID: 2,
    order_time: '2018-11-19 12:22:12',
    status: 3
  },
  {
    receipt_ID: 1,
    employee_ID: 4,
    table_ID: 1,
    menu_ID: 3,
    order_time: '2018-11-19 12:32:12',
    status: 3
  },
  {
    receipt_ID: 2,
    employee_ID: 3,
    table_ID: 3,
    menu_ID: 1,
    order_time: '2018-11-20 14:10:00',
    status: 3
  },
  {
    receipt_ID: null,
    employee_ID: 3,
    table_ID: 2,
    menu_ID: 2,
    order_time: '2018-11-20 14:20:00',
    status: 2
  },
  {
    receipt_ID: 2,
    employee_ID: 4,
    table_ID: 3,
    menu_ID: 3,
    order_time: '2018-11-20 14:30:00',
    status: 3
  },
  {
    receipt_ID: null,
    employee_ID: null,
    table_ID: 2,
    menu_ID: 2,
    order_time: '2018-11-20 14:40:00',
    status: 0
  }
];
const receipts = [
  { table_ID: 1, total_price: 945.0, issue_date: '2018-11-19 12:42:12' },
  { table_ID: 1, total_price: 305.0, issue_date: '2018-11-20 15:00:00' }
];
const recommendations = [
  {
    receipt_ID: 1,
    commentator_name: 'Mr. Marion Fritsch',
    comment: 'This system is good! Gj, this is not DB group, yeah!'
  },
  {
    receipt_ID: 2,
    commentator_name: 'Ms. Cathrine Osinski',
    comment: 'Tuna salad is good. '
  }
];

const reserves =[
    {member_ID: 3, table_ID:3, reserve_time:'2019-01-01 14:00:00' , number_of_reserved: 1, create_time:'2018-11-20 09:00:00'},
    {member_ID: 3, table_ID:3, reserve_time:'2019-01-01 19:20:00' , number_of_reserved: 1, create_time:'2018-11-20 09:00:00'},
    {member_ID: 3, table_ID:4, reserve_time:'2019-01-01 14:20:00' , number_of_reserved: 1, create_time:'2018-11-20 09:00:00'},
    {member_ID: 2, table_ID:1, reserve_time:'2019-01-02 18:00:00' , number_of_reserved: 1, create_time:'2018-11-20 09:00:00'},
    {member_ID: 2, table_ID:2, reserve_time:'2019-01-02 14:00:00' , number_of_reserved: 1, create_time:'2018-11-20 09:00:00'},
    {member_ID: 2, table_ID:3, reserve_time:'2019-01-02 14:00:00' , number_of_reserved: 1, create_time:'2018-11-20 09:00:00'},
    {member_ID: 2, table_ID:4, reserve_time:'2019-01-02 13:00:00' , number_of_reserved: 1, create_time:'2018-11-20 09:00:00'},
    {member_ID: 2, table_ID:5, reserve_time:'2019-01-02 14:00:00' , number_of_reserved: 1, create_time:'2018-11-20 09:00:00'},
    {member_ID: 2, table_ID:6, reserve_time:'2019-01-02 14:00:00' , number_of_reserved: 1, create_time:'2018-11-20 09:00:00'},
    {member_ID: 3, table_ID:3, reserve_time:'2020-01-01 14:00:00' , number_of_reserved: 1, create_time:'2018-11-20 09:00:00'},
    {member_ID: 3, table_ID:3, reserve_time:'2020-01-01 11:20:00' , number_of_reserved: 1, create_time:'2018-11-20 09:00:00'},
    {member_ID: 3, table_ID:4, reserve_time:'2020-06-01 12:20:00' , number_of_reserved: 1, create_time:'2018-11-20 09:00:00'},
    {member_ID: 2, table_ID:1, reserve_time:'2020-03-02 14:00:00' , number_of_reserved: 1, create_time:'2018-11-20 09:00:00'},
    {member_ID: 2, table_ID:2, reserve_time:'2020-07-02 14:00:00' , number_of_reserved: 1, create_time:'2018-11-20 09:00:00'},
    {member_ID: 2, table_ID:3, reserve_time:'2020-01-02 13:00:00' , number_of_reserved: 1, create_time:'2018-11-20 09:00:00'},
    {member_ID: 2, table_ID:4, reserve_time:'2020-01-02 14:00:00' , number_of_reserved: 1, create_time:'2018-11-20 09:00:00'},
    {member_ID: 2, table_ID:5, reserve_time:'2020-03-02 12:00:00' , number_of_reserved: 1, create_time:'2018-11-20 09:00:00'},
    {member_ID: 2, table_ID:6, reserve_time:'2020-01-02 10:00:00' , number_of_reserved: 1, create_time:'2018-11-20 09:00:00'},
];

const numAccount = account.length;
const numMember = member.length;
const numEmployee = employee.length;
const numTable = TableSize.length;
const numMenu = menus.length;
const numThumbnail = 10;
const numPromo = 5;
const numSale = 5;
const numOrder = orders.length;
const numReceipt = receipts.length;
const numRecommendation = recommendations.length;
const numReserve = reserves.length;

const tables = [
  'ACCOUNT',
  'EMPLOYEE',
  'EMPLOYEE_WAITER',
  'EMPLOYEE_CHEF',
  'EMPLOYEE_MANAGER',
  'MEMBER',
  'TABLE',
  'RESERVE',
  'MENU',
  'MENU_THUMBNAIL',
  'SALE',
  'RECEIPT',
  'RECOMMENDATION',
  'PROMOTION',
  'APPLY_PROMOTION',
  'ORDER'
];

const terminate = () => {
  process.exit(0);
};

const createCallback = (callback, showError, showResult) => {
  return (err, result) => {
    if (showError && err) {
      console.log(err);
      terminate();
    }
    if (showResult) console.log(result);
    callback();
  };
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
        db.query('USE ' + DB, () => callback());
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
            if(employee[i].employee_type==0)  employees.push(i+1);
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
            if(employee[i].employee_type==1)  employees.push(i+1);
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
            if(employee[i].employee_type==2)  employees.push(i+1);
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

    //Generate receipt
    const seedReceipt = (callback) => {

        executeCommandSeq(db, numReceipt, (i) => {

            const table_ID       = receipts[i].table_ID;
            const total_price      = receipts[i].total_price;
            const issue_date      = receipts[i].issue_date;
            const payment      = (i%3)%2;

            return (callback) => {
                db.query("INSERT INTO `RECEIPT` " +
                    "(`table_ID`, `total_price`,`issue_date`,`payment`)" +
                    " VALUES " +
                    `(\"${table_ID}\", \"${total_price}\", \"${issue_date}\",\"${payment}\")`
                    , createCallback(callback, true, false));
            };
        }, callback);
    };

	// Generate Order
    const seedOrder = (callback) => {

        executeCommandSeq(db, numOrder, (i) => {

            const menu_ID       = orders[i].menu_ID;
            const receipt_ID    = orders[i].receipt_ID;
            const employee_ID   = orders[i].employee_ID;
            const table_ID      = orders[i].table_ID;
            const order_time    = orders[i].order_time;
            const status        = orders[i].status

            return (callback) => {
                db.query("INSERT INTO `ORDER` " +
                    "(`menu_ID`, `receipt_ID`,`employee_ID`,`table_ID`,`order_time`,`status`)" +
                    " VALUES " +
                    `(\"${menu_ID}\", ${receipt_ID}, ${employee_ID},\"${table_ID}\",\"${order_time}\",\"${status}\")`
                    , createCallback(callback, true, false));
            };
        }, callback);
    };    

    //Generate recommendation
    const seedRecommendation = (callback) => {

        executeCommandSeq(db, numRecommendation, (i) => {

            const receipt_ID        = recommendations[i].receipt_ID;
            const commentator_name  = recommendations[i].commentator_name;
            const comment           = recommendations[i].comment;
            const rating            = 5-(i%2);

            return (callback) => {
                db.query("INSERT INTO `RECOMMENDATION` " +
                    "(`receipt_ID`, `commentator_name`,`comment`,`rating`)" +
                    " VALUES " +
                    `(\"${receipt_ID}\", \"${commentator_name}\", \"${comment}\", \"${rating}\")`
                    , createCallback(callback, true, false));
            };
        }, callback);
    };

    //Generate reserve
    const seedReserve = (callback) => {

        executeCommandSeq(db, numReserve, (i) => {

            const member_ID            = reserves[i].member_ID;
            const table_ID             = reserves[i].table_ID;
            const reserve_time         = reserves[i].reserve_time;
            const number_of_reserved   = reserves[i].number_of_reserved;
            const create_time          = reserves[i].create_time;

            return (callback) => {
                db.query("INSERT INTO `RESERVE` " +
                    "(`member_ID`, `table_ID`,`reserve_time`,`number_of_reserved`,`create_time`)" +
                    " VALUES " +
                    `(\"${member_ID}\", \"${table_ID}\", \"${reserve_time}\", \"${number_of_reserved}\", \"${create_time}\")`
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
        seedReceipt,
        seedRecommendation,
        seedReserve,
        seedOrder,
        // checkMember,
        // checkTable,
        terminate,
    ], 1)();
});
