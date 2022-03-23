const path = require("path")
const { v4: uuidv4 } = require("uuid")
const express = require("express")
const session = require("express-session")
const router = require("./router")
const connection = require("./model")

const app = express()

const port = process.env.port || 3001

app.use(express.json())

app.use(express.urlencoded({ extended: false }))

app.use(
	session({
		secret: uuidv4(),
		resave: false,
		saveUninitialized: true,
	})
)

app.use((req, res, next) => {
	if (!req.user) {
		res.header(
			"Cache-Control",
			"private, no-cache, no-store, must-revalidate"
		)
		res.header("Expires", "-1")
		res.header("Pragma", "no-cache")
	}
	next()
})

app.use("/assets", express.static(path.join(__dirname, "assets")))

app.use("/route", router)

app.set("view engine", "ejs")

app.get("/admin/:error?", (req, res) => {
	try {
		res.render("adminLogin",{error: req.params.error})
	} catch (err) {
		console.log(err.message)
	}
})

app.get("/:error?", (req, res) => {
	try {
		res.render("userLogin",{error: req.params.error})
	} catch (err) {
		console.log(err.message)
	}
})

app.listen(port, (err) => {
	if (err) {
		console.log("error creating server")
	} else {
		console.log(`Listening at http://localhost:${port}`)
	}
})
