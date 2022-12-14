const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	username: { type: String, required: true },
	email: { type: String, required: true },
	passwd: { type: String, required: true },
});
mongoose.model("users", UserSchema);
