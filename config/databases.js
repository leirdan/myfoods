// se estiver conectado ao mLab, use o banco de dados de lá; senão, use o da máquina.
if (process.env.NODE_ENV == "production") {
	module.exports = { mongoURI: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@myfoods-prod.btbvtfb.mongodb.net/test` };
} else {
	module.exports = { mongoURI: "mongodb://localhost:27017/myFoods" };
}
