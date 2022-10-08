const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bCrypt = require("bcryptjs");
require("../models/User");
const UserSchema = mongoose.model("users");

module.exports = function (passport) {
	passport.use(
		new localStrategy({ usernameField: "email", passwordField: "passwd" }, (email, passwd, done) => {
			UserSchema.findOne({ email: email })
				.lean()
				.then((user) => {
					if (!user) {
						// 1º param: dados da conta autenticada; 2º: se a autenticacao foi sucedida; 3º: resultado
						return done(null, false, { message: "Esse perfil não existe" });
					}
					bCrypt.compare(passwd, user.passwd, (err, areTheSame) => {
						if (areTheSame) {
							return done(null, user);
						} else {
							return done(null, false, { message: "Senha incorreta." });
						}
					});
				});
		})
	);
	passport.serializeUser((user, done) => {
		done(null, user);
	});
	passport.deserializeUser((id, done) => {
		UserSchema.findById(id, (err, user) => {
			done(err, user);
		});
	});
};
