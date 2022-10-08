const Express = require("Express");
const app = Express();
const handlebars = require("Express-handlebars");
const dietRoutes = require("./Routes/diet_routes");
const mealsRoutes = require("./Routes/meals_routes");
const userRoutes = require("./Routes/user_routes");
const path = require("path");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const session = require("Express-session");
const flash = require("connect-flash");
const passport = require("passport");
require("./config/auth")(passport);
const { isLogged } = require("./helpers/isLogged");
const database = require("./config/databases");

// CONFIGURAÇÕES
app.use(
	session({
		secret: "havohejpantocrator",
		resave: true,
		saveUninitialized: true,
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
	res.locals.success_msg = req.flash("success_msg");
	res.locals.error_msg = req.flash("error_msg");
	res.locals.error = req.flash("error");
	res.locals.user = req.user || null; // armazena dados do usuário autenticado ou não armazena nada
	next();
});

app.engine("handlebars", handlebars.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(Express.urlencoded({ extended: true }));
app.use(Express.json());
app.use(Express.static(path.join(__dirname, "Public")));

mongoose
	.connect(database.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log("Conectado com sucesso ao Mongo!");
	})
	.catch((err) => {
		console.log(`Algo deu errado: ${err}`);
	});
app.use("/index", (req, res) => {
	res.render("homepage");
});
app.use("/home", isLogged, (req, res) => {
	const user = {
		username: req.user.username,
	};
	res.render("admin/index", { user: user });
});
app.use("/user", userRoutes);
app.use("/alimentos", mealsRoutes);
app.use("/dieta", dietRoutes);

const isRunning = () => {
	console.log("Servidor aberto e em funcionamento!");
};
const PORT = process.env.PORT || 8080;
app.listen(PORT, isRunning());
