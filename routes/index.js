const testRoutes = require('./test');
const authRoutes = require('./auth');
const utilsRoutes = require('./utils');
const blogRoutes = require('./blog');
const authenticate = require('../middlewares/authenticate');

module.exports = app => {
	// if there is a user logged in, it adds it to the request object (req.user)
	app.use(authenticate)
	// define all the routes
	app.get('/', (req, res) => {
			res.status(200).json({message: "Welcome to the API"});
	});
	app.use('/auth', authRoutes);
	app.use('/blog', blogRoutes);
	app.use('/utils', utilsRoutes);
	// app.use('/users', userRoutes);
	app.use('/test', testRoutes);
};


