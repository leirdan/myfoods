const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DietSchema = new Schema({
	name: { type: String, required: true },
	hour: { type: String, required: true },
	minutes: { type: String, required: true },
	meals: [{ type: Schema.Types.ObjectId, ref: "meals" }], // Múltiplos valores
	notes: { type: String },
	author: { type: Schema.Types.ObjectId, ref: "users" },
});

mongoose.model("diet", DietSchema);
