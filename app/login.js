module.exports = {

	// middleware
	checkAuthen: (req, res, next) => next(),
	checkMember: (req, res, next) => next(), 
	checkEmployee: (req, res, next) => next(), 
	checkManager: (req, res, next) => next(),

	// login JSON api
	login: (req, res) => {},
	logout: (req, res) => { req.back() },

	// login ui
	ui: (req, res) => { res.send("login page"); },
};
