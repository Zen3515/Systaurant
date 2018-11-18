main = (req, res) => {
	res.sendFile("index.html", {
		root: __dirname  + '/../view'
	}); 
};

module.exports = {

	// return home page
	ui: main, 
};
