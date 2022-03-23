const mongoose = require("mongoose")

let blogSchema = new mongoose.Schema({
	heading: {
		type: String,
		required: "Required",
	},
	content: {
		type: String,
	},
	author: {
		type: String,
	},
})

module.exports = mongoose.model("blogs", blogSchema)
