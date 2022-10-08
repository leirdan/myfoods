const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MealSchema = new Schema({
	name: { type: String, required: true },
	info: { type: String },
	amount: { type: String, required: true },
	date: { type: Date, default: Date.now() },
	author: { type: Schema.Types.ObjectId, ref: "users.username" },
});

mongoose.model("meals", MealSchema);
