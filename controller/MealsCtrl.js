const mongoose = require("mongoose");
require("../models/Meal");
const MealSchema = mongoose.model("meals");

// Mostrar refeições
exports.index = (req, res) => {
	const user = req.user;
	MealSchema.find({ author: user })
		.lean()
		.sort({ date: "desc" })
		.then((data) => {
			res.render("meals/index", { meal: data });
		})
		.catch((err) => {
			req.flash("error_msg", `Não foi possível listar suas refeições: ${err}`);
			res.redirect("/home");
		});
};
// Mostrar tela de cadastro
exports.register = (req, res) => {
	res.render("meals/register");
};
// Enviar dados de cadastro de refeição
exports.insert = (req, res) => {
	let errors = [];
	if (req.body.name == "" || typeof req.body.name == undefined) {
		errors.push({ text: "Nome muito curto!" });
	}
	if (req.body.amount == "" || typeof req.body.amount == undefined) {
		errors.push({ text: "Insira alguma quantidade!" });
	}
	if (errors.length > 0) {
		res.render("meals/register", { errs: errors });
	} else {
		const meal = {
			name: req.body.name,
			info: req.body.info,
			amount: req.body.amount,
			author: req.user,
		};
		new MealSchema(meal)
			.save()
			.then(() => {
				req.flash("success_msg", "Alimento criado com sucesso!");
				res.redirect("/alimentos");
			})
			.catch((err) => {
				req.flash("error_msg", `Não foi possível adicionar: ${err}`);
				res.redirect("/alimentos");
			});
	}
};
// Deletar refeição
exports.delete = (req, res) => {
	MealSchema.findOneAndRemove({ id: req.params.id, author: req.user })
		.then(() => {
			req.flash("success_msg", "Alimento excluído com sucesso.");
			res.redirect("/alimentos");
		})
		.catch((err) => {
			req.flash("error_msg", `Não foi possível excluir: ${err}`);
			res.redirect("/alimentos");
		});
};
// Mostrar tela de edição
exports.edit = (req, res) => {
	MealSchema.findOne({ name: req.params.name })
		.lean()
		.then((data) => {
			res.render("meals/edit", { meal: data });
		})
		.catch((err) => {
			req.flash("error_msg", "Não foi possível encontrar o alimento.");
			res.redirect("/alimentos");
		});
};
// Enviar dados de edição
exports.alter = (req, res) => {
	let errors = [];
	if (req.body.name == "" || typeof req.body.name == undefined) {
		errors.push({ text: "Nome muito curto!" });
	}
	if (req.body.amount == "" || typeof req.body.amount == undefined) {
		errors.push({ text: "Insira alguma quantidade!" });
	}
	if (errors.length > 0) {
		res.render("meals/edit", { errs: errors });
	} else {
		MealSchema.findOne({ id: req.body.id })
			.then((alteredMeal) => {
				alteredMeal.name = req.body.name;
				alteredMeal.amount = req.body.amount;
				alteredMeal.info = req.body.info;
				alteredMeal
					.save()
					.then(() => {
						req.flash("success_msg", "Alterações salvas com sucesso!");
						res.redirect("/alimentos");
					})
					.catch((err) => {
						req.flash("error_msg", `Não foi possível salvar: ${err}`);
						res.redirect("/alimentos/editar");
					});
			})
			.catch((err) => {
				req.flash("error_msg", `${err}`);
				res.redirect("/alimentos");
			});
	}
};
