const mongoose = require("mongoose")

let adminSchema = new mongoose.Schema({
	admin: {
		type: String,
		required: "Required",
	},
	password: {
		type: String,
	},
	email: {
		type: String,
	},
})

module.exports = mongoose.model("admins", adminSchema)
