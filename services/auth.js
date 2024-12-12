// const jwt = require('jsonwebtoken');// import passport and passport-jwt modules

// const passport = require('passport');
// const passportJWT = require('passport-jwt');// ExtractJwt to help extract the token

// let ExtractJwt = passportJWT.ExtractJwt;// JwtStrategy which is the strategy for the authentication

// let JwtStrategy = passportJWT.Strategy;
// let jwtOptions = {};
// jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

// jwtOptions.secretOrKey = process.env.JWT_SECRET;

// // lets create our strategy for web token
// let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
//   console.log('auth.js - payload received', jwt_payload);
//   let user = getUser({ id: jwt_payload.id });
//   if (user) {
//     next(null, user);
//   } else {
//     next(null, false);
//   }
// });
// // use the strategy
// passport.use(strategy);

// module.exports = passport;