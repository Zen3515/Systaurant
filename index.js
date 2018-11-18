const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

// set app port
const port = 3000;

// import all required part
const admin = require('./app/admin.js');
const login = require('./app/login.js');
const main = require('./app/main.js');
const menu = require('./app/menu.js');
const order = require('./app/order.js');
const promo = require('./app/promo.js');
const reserve = require('./app/reserve.js');
const sale = require('./app/sale.js');
const sql = require('./app/sql.js');

const jsonRequire = (req, res, next) => {
  if (req.body === undefined) {
    res.status(400).send(
      JSON.stringify({
        message: 'JSON parsing failed'
      })
    );
    return;
  }
  next();
};

const jsonResponse = (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
};

// list of all available views

const app = express();

// add session
app.use(
  session({
    secret: 'xaapIrr5gPHvHzWVry4jF14bfHA33cvI',
    resave: false,
    saveUninitialized: true
  })
);

// add public files
app.use(express.static('public'));

app.get('/', main.ui);
app.get('/admin', login.checkManager, admin.ui);
app.get('/login', login.ui);
app.get('/login/table', login.table_ui);
app.get('/menu', menu.ui);
app.get('/order', order.ui);
app.get('/reserve', reserve.ui);

// list of all available APIs

const api = express();

// parse application/x-www-form-urlencoded
api.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
api.use(bodyParser.json());

api.use(jsonRequire);
api.use(jsonResponse);

api.post('/login', login.login);
api.post('/login/table', login.login_table);
api.post('/logout', login.logout);

api.get('/menu', menu.read);
api.get('/reserve/create', reserve.create);
api.get('/reserve/cancel', reserve.cancel);

api.get('/order/create', order.create);
api.get('/order/cancel', order.cancel);
api.get('/order/accept', order.accept);

// admin API
const adminAPI = express();

adminAPI.use(login.checkManager);

// parse application/x-www-form-urlencoded
adminAPI.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
adminAPI.use(bodyParser.json());

adminAPI.post('/promo/create', promo.create);
adminAPI.post('/promo/update', promo.update);
adminAPI.post('/promo/delete', promo.remove);

adminAPI.post('/sale/create', sale.create);
adminAPI.post('/sale/update', sale.update);
adminAPI.post('/sale/delete', sale.remove);

adminAPI.post('/menu/create', menu.create);
adminAPI.post('/menu/update', menu.update);
adminAPI.post('/menu/delete', menu.remove);

api.use('/admin', adminAPI);

// direct sql accesss
api.post('/sql', sql.api);

// enable APIs using only JSON
app.use('/api', api);

// start server
app.listen(port, () => console.log(`Systaurant is running on port ${port}!`));
