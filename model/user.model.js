const mongoose = require('mongoose')

let userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: "Required",
	},
	userName: {
		type: String,
		required: "Required",
		unique: true,
	},
	password: {
		type: String,
	},
	email: {
		type: String,
		unique: true,
	},
})

module.exports = mongoose.model("users", userSchema)
