const express = require("express");
const router = express.Router();
const DietCtrl = require("../controller/DietCtrl");
const { isLogged } = require("../helpers/isLogged");

router.get("/", isLogged, DietCtrl.index);
router.get("/criar-dieta", isLogged, DietCtrl.register);
router.post("/criar-dieta/sucesso", isLogged, DietCtrl.insert);
router.get("/deletar/:name", isLogged, DietCtrl.delete);
router.get("/editar/:name", isLogged, DietCtrl.edit);
router.post("/editar/sucesso", isLogged, DietCtrl.alter);
module.exports = router;
