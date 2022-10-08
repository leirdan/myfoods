const mongoose = require("mongoose");
require("../models/Meal");
const MealSchema = mongoose.model("meals");
require("../models/Diet");
const DietSchema = mongoose.model("diet");
// Mostra a tela inicial
exports.index = (req, res) => {
	const user = req.user;
	DietSchema.find({ author: user })
		.lean()
		.populate("meals")
		.sort({ hour: "asc", minutes: "asc" })
		.then((dietData) => {
			res.render("diet/index", { diet: dietData });
			/*
			for (key in dietData) {
				for (let i = 0; i <= key + 1; i++) {
					console.log(dietData[key].meals[i].name);
					console.log(dietData[key].meals[i].amount);
				}*/
		})
		.catch((err) => {
			req.flash("error_msg", `${err}`);
			res.redirect("/hudson");
		});
};
// Mostra a tela de cadastro
exports.register = (req, res) => {
	const user = req.user;
	MealSchema.find({ author: user })
		.lean()
		.then((data) => {
			res.render("diet/register", { meal: data });
		});
};
// Envia os dados e cria uma nova refeição
exports.insert = (req, res) => {
	let errors = [];
	if (req.body.name == "" || req.body.name == undefined) {
		errors.push({ text: "Dê um nome à sua refeição!" });
	}
	if (req.body.hour == undefined || req.body.hour < 0 || req.body.hour > 23 || req.body.hour == "") {
		errors.push({ text: "Hora inválida!" });
	}
	if (req.body.minutes == undefined || req.body.minutes < 0 || req.body.minutes == "" || req.body.minutes > 59) {
		errors.push({ text: "Minutos estão incorretos." });
	}
	if (!req.body.optionMeal) {
		errors.push({ text: "Selecione ao menos uma opção de comida!" });
	}
	if (errors.length > 0) {
		const user = req.user;
		MealSchema.find({ author: user })
			.lean()
			.then((data) => {
				res.render("diet/register", { errs: errors, meal: data });
			});
	} else {
		const schedule = {
			name: req.body.name,
			hour: req.body.hour,
			minutes: req.body.minutes,
			meals: req.body.optionMeal,
			notes: req.body.notes,
			author: req.user,
		};
		new DietSchema(schedule)
			.save()
			.then(() => {
				req.flash("success_msg", "Horário de refeição adicionado com sucesso!");
				res.redirect("/dieta");
			})
			.catch((err) => {
				req.flash("error_msg", `${err}`);
				res.redirect("/dieta");
			});
	}
};
// Deleta uma refeição
exports.delete = (req, res) => {
	DietSchema.findOneAndDelete({ name: req.params.name })
		.then(() => {
			req.flash("success_msg", "Refeição eliminada com sucesso.");
			res.redirect("/dieta");
		})
		.catch((err) => {
			req.flash("error_msg", `${err}`);
			res.redirect("/dieta");
		});
};
// Mostra a tela de edição
exports.edit = (req, res) => {
	DietSchema.findOne({ name: req.params.name })
		.lean()
		.populate("meals")
		.then((dData) => {
			MealSchema.find({ author: req.user })
				.lean()
				.then((mData) => {
					res.render("diet/edit", { diet: dData, meals: mData });
				});
		})
		.catch((err) => {
			req.flash("error_msg", `${err}`);
			res.redirect("/dieta");
		});
};
// Altera dados da refeição
exports.alter = (req, res) => {
	let errors = [];
	if (req.body.name == "" || req.body.name == undefined) {
		errors.push({ text: "Dê um nome à sua refeição!" });
	}
	if (req.body.hour == undefined || req.body.hour < 0 || req.body.hour > 23 || req.body.hour == "") {
		errors.push({ text: "Hora inválida!" });
	}
	if (req.body.minutes == undefined || req.body.minutes < 0 || req.body.minutes == "" || req.body.minutes > 59) {
		errors.push({ text: "Minutos estão incorretos." });
	}
	if (!req.body.optionMeal) {
		errors.push({ text: "Selecione ao menos uma opção de comida!" });
	}
	if (errors.length > 0) {
		const user = req.user;
		MealSchema.find({ author: user })
			.lean()
			.then((data) => {
				res.render("diet/edit", { errs: errors, meal: data });
			});
	} else {
		DietSchema.findOne({ id: req.body.id })
			.then((update) => {
				update.name = req.body.name;
				update.hour = req.body.hour;
				update.minutes = req.body.minutes;
				update.optionMeal = req.body.optionMeal;
				update.notes = req.body.notes;
				update.save()
					.then(() => {
						req.flash("success_msg", "Alteração concluída com sucesso ;)");
						res.redirect("/dieta");
					})
					.catch((err) => {
						req.flash("error_msg", `${err}`);
						res.redirect("/dieta");
					});
			})
			.catch((err) => {
				req.flash("error_msg", `${err}`);
				res.redirect("/dieta");
			});
	}
};
