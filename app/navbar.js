navbar = (req, res) => {
	res.sendFile("navbar.html", {
		root: __dirname  + '/../view'
	}); 
};

module.exports = {

	// navbar for every page
	ui: navbar, 
};