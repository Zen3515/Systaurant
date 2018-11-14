module.exports = {

	// return home page
	ui: (req, res) => { res.sendFile("index.html", {
		root: __dirname  + '/../view'
	}); },
};
