const path = require("path")
const { v4: uuidv4 } = require("uuid")
const express = require("express")
const session = require("express-session")
const router = require("./router")
const routeAdmin = require("./routeAdmin")
const connection = require("./model")
const flash = require('connect-flash')

const app = express()

const port = process.env.port || 3001

app.use(flash())

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
app.use("/route", routeAdmin)

app.set("view engine", "ejs")

app.get("/admin", (req, res) => {
	try {
		let err = req.flash('error')
		if (err) res.status(301)
		else res.status(200)
		res.render("adminLogin", { error: err })
	} catch (err) {
		console.log(err.message)
	}
})

app.get("/", (req, res) => {
	try {
		if (req.query.error) res.status(301)
		else res.status(200)
		res.render("userLogin", {
			error: req.flash("error"),
			success: req.flash("message"),
		})
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
