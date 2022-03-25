const mongoose = require('mongoose')

let userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: "Required",
		trim: true,
		minlength: [2, "Atleast 2 character required"],
	},
	userName: {
		type: String,
		required: "Required",
		trim: true,
		unique: true,
		minlength: [5, "Atleast 5 character required"],
	},
	password: {
		type: String,
		minlength: [6, "Atleast 6 character required"],
	},
	email: {
		type: String,
		trim: true,
		unique: true,
	},
})

module.exports = mongoose.model("users", userSchema)
