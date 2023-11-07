// import passport, { DoneCallback } from "passport";
// import passportJWT from "passport-jwt";
// import { User } from "./db/models/user";
// import { JwtPayload } from "jsonwebtoken";
//
// const JWTStrategy = passportJWT.Strategy;
// const ExtractJWT = passportJWT.ExtractJwt;
//
// const verifyCallback = async (payload: JwtPayload, done: DoneCallback) => {
// 	try {
// 		const user = await User.findOne({ _id: payload._id });
// 		return done(null, user);
// 	} catch (err) {
// 		return done(err);
// 	}
// };
//
// export default () => {
// 	const config = {
// 		jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
// 		secretOrKey: process.env.JWT_SECRET,
// 	};
//
// 	passport.use(User.createStrategy());
// 	passport.use(new JWTStrategy(config, verifyCallback));
// };
