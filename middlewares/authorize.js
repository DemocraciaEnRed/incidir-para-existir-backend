const passport = require("passport");
const msg = require('../utils/messages.js');

module.exports = (roles) => (req, res, next) => {
	// optionalAuthenticate runs first, so it will set req.user if there is a token

	// if there is no user, dont continue
	if (!req.user) {
		console.error('authenticate.js - No Token Provided!');
		return res.status(401).json({ message: msg.auth.error.noToken });
	}
	// If roles is not defined, allow access to all roles
	if (roles == undefined || roles == null) {
		return next();
	}

	const userRole = req.user.role;
	
	if (Array.isArray(roles)) {
		// If roles is an array, check if the user has any of these roles
		if (roles.includes(userRole)) {
			return next(); // User has the required role, allow access
		} else {
			console.error('authenticate.js - User does not have the required role');
			return res.status(403).json({ message: msg.error.default }); // User doesn't have the required role
		}
	} else if (typeof roles === 'string') {
		// If roles is a single string, check if the user has this role
		if (userRole === roles) {
			return next(); // User has the required role, allow access
		} else {
			console.error('authenticate.js - User does not have the required role');
			return res.status(403).json({ message: msg.error.default }); // User doesn't have the required role
		}
	} else {
		console.error('authenticate.js - Invalid role configuration');
		return res.status(500).json({ message: msg.error.default }); // Invalid role configuration
	}

}
	