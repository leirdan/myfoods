const mongoose = require("mongoose");
require("../models/User");
const UserSchema = mongoose.model("users");
const bCrypt = require("bcryptjs");
const passport = require("passport");

// Mostrar tela de login
exports.login = (req, res) => {
	res.render("users/login");
};
// Entrar
exports.enter = (req, res, next) => {
	passport.authenticate("local", {
		successRedirect: "/home",
		failureRedirect: "/user/login",
		failureFlash: true,
	})(req, res, next);
};
exports.logout = (req, res, next) => {
	req.logout((err) => {
		if (err) {
			return next(err);
		} else {
			req.flash("success_msg", "Deslogado com sucesso.");
			res.redirect("/index");
		}
	});
};
// Mostrar tela de cadastro
exports.register = (req, res) => {
	res.render("users/register");
};
// Criar um novo usuário
exports.create = (req, res) => {
	let errors = [];
	if (req.body.username == undefined || req.body.username == "") {
		errors.push({ text: "Nome de usuário inválido." });
	}
	if (req.body.email == undefined || req.body.email == "") {
		errors.push({ text: "E-mail inválido." });
	}
	if (req.body.passwd == undefined || req.body.passwd == "" || req.body.passwd2 == undefined || req.body.passwd2 == "") {
		errors.push({ text: "Insira uma senha nos dois campos." });
	}
	if (req.body.passwd != req.body.passwd2) {
		errors.push({ text: "As senhas não coincidem." });
	}
	if (errors.length > 0) {
		res.render("users/register", { errs: errors });
	} else {
		UserSchema.findOne({ email: req.body.email })
			.then((user) => {
				if (user) {
					req.flash("error_msg", "Já existe uma conta com esse e-mail. ");
					res.redirect("/user/create");
				} else {
					const user = new UserSchema({
						username: req.body.username,
						email: req.body.email,
						passwd: req.body.passwd,
					});
					bCrypt.genSalt(10, (err, salt) => {
						bCrypt.hash(user.passwd, salt, (err, hash) => {
							if (err) {
								req.flash("error_msg", `${err}`);
								res.redirect("/user/create");
							} else {
								user.passwd = hash;
								user.save()
									.then(() => {
										req.flash("success_msg", `Sua conta foi criada com sucesso.`);
										res.redirect("/user/login");
									})
									.catch((err) => {
										req.flash("error_msg", `${err}`);
										res.redirect("/user/register");
									});
							}
						});
					});
				}
			})
			.catch((err) => {
				req.flash("error_msg", `${err}`);
				res.redirect("/user/login");
			});
	}
};
