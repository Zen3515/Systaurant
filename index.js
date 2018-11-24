const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

// set app port
const port = 3000;

// import all required part
const admin       = require('./app/admin.js');
const login       = require('./app/login.js');
const main        = require('./app/main.js');
const menu        = require('./app/menu.js');
const order       = require('./app/order.js');
const promo       = require('./app/promo.js');
const reserve     = require('./app/reserve.js');
const receipt     = require('./app/receipt.js');
const sale        = require('./app/sale.js');
const sql         = require('./app/sql.js');

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

app.get('/'               , main.ui);
app.get('/admin'          , login.checkManager   , admin.ui);
app.get('/admin/menu'     , login.checkManager   , admin.menu_ui);
app.get('/admin/sale'     , login.checkManager   , admin.sale_ui);
app.get('/admin/promo'    , login.checkManager   , admin.promo_ui);
app.get('/login'          , login.ui);
app.get('/login/table'    , login.table_ui);
app.get('/logout'         , login.logout);
app.get('/logout/table'   , login.logout_table);
app.get('/menu'           , menu.ui);
app.get('/order'          , login.checkTable     , order.ui);
app.get('/order/cooklist' , login.checkEmployee  , order.cooklist_ui);
app.get('/order/waitlist' , login.checkEmployee  , order.waitlist_ui);
app.get('/receipt'        , login.checkReceipt   , receipt.ui);
app.get('/reserve'        , login.checkMember    , reserve.ui);

// list of all available APIs

const api = express();

// parse application/x-www-form-urlencoded
api.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
api.use(bodyParser.json());

api.use(jsonRequire);
api.use(jsonResponse);

api.post('/login'          , login.login);
api.post('/login/table'    , login.login_table);
api.post('/status'         , login.stat);

api.post('/menu'           , menu.read);
api.post('/reserve/read'   , login.checkAuthen    , reserve.read);
api.post('/reserve/create' , login.checkAuthen    , reserve.create);
api.post('/reserve/cancel' , login.checkAuthen    , reserve.cancel);

api.post('/receipt/read'   , login.checkReceipt   , receipt.read);
api.post('/receipt/create' , receipt.create);

api.post('/order'          , login.checkTable             , order.read);
api.post('/order/receipt'  , login.checkReceipt           , order.readReceipt);
api.post('/order/cooklist' , login.checkEmployee          , order.cooklist);
api.post('/order/waitlist' , login.checkEmployee          , order.waitlist);
api.post('/order/create'   , login.checkTable             , order.create);
api.post('/order/cancel'   , login.checkTable             , order.cancel);
api.post('/order/accept'   , login.checkEmployee          , order.accept);
api.post('/order/decline'  , login.checkEmployee          , order.decline);
api.post('/order/done'     , login.checkEmployee          , order.done);
api.post('/order/receive'  , login.checkEmployeeOrTable   , order.receive);

// admin API
const adminAPI = express();

adminAPI.use(login.checkManager);

// parse application/x-www-form-urlencoded
adminAPI.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
adminAPI.use(bodyParser.json());

adminAPI.use(jsonRequire);
adminAPI.use(jsonResponse);

adminAPI.post('/promo/read'  , promo.read);
adminAPI.post('/promo/create', promo.create);
adminAPI.post('/promo/update', promo.update);
adminAPI.post('/promo/delete', promo.remove);

adminAPI.post('/sale/read'  , sale.read);
adminAPI.post('/sale/create', sale.create);
adminAPI.post('/sale/update', sale.update);
adminAPI.post('/sale/delete', sale.remove);

adminAPI.post('/menu/read'  , menu.read);
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
