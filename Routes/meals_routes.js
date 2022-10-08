const Express = require("express");
const router = Express.Router();
const mealsCtrl = require("../controller/MealsCtrl");
const { isLogged } = require("../helpers/isLogged");

router.get("/", isLogged, mealsCtrl.index);
router.get("/registro", isLogged, mealsCtrl.register);
router.post("/registro-sucesso", isLogged, mealsCtrl.insert);
router.get("/deletar/:id", isLogged, mealsCtrl.delete);
router.get("/editar/:name", isLogged, mealsCtrl.edit);
router.post("/editar-sucesso", isLogged, mealsCtrl.alter);

module.exports = router;
