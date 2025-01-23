const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models').User;
const Subdivision = require('../models').Subdivision;
const City = require('../models').City;

const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET
};

module.exports = passport => {
	passport.use(
		new JwtStrategy(opts, (jwt_payload, done) => {
			User.findOne({
				attributes: ['id', 'firstName', 'lastName', 'fullName', 'role', 'subdivisionId'],
				include: {
					model: Subdivision,
					as: 'subdivision',
					attributes: ['id', 'name'],
					include: [
						{
							model: City,
							as: 'city',
							attributes: ['id', 'name'],
						}
					]
				},
				where: {
					id: jwt_payload.id
				}
			})
				.then(user => {
					if (user) return done(null, user);
					return done(null, false);
				})
				.catch(err => {
					return done(err, false, { message: '[JWT Middleware] Hubo un error en la autenticación' });
				});
		})
	);
};