const menu_ui = (req, res) => {
  	res.sendFile('admin_menu.html', {
    	root: __dirname + '/../view'
  	});
};

const sale_ui = (req, res) => {
  	res.sendFile('admin_sale.html', {
    	root: __dirname + '/../view'
  	});
};

const promo_ui = (req, res) => {
  	res.sendFile('admin_promo.html', {
    	root: __dirname + '/../view'
  	});
};

module.exports = {

	// return admin page
	menu_ui: menu_ui,
    sale_ui: sale_ui,
	promo_ui: promo_ui,
};
