const express = require("express")
const bcrypt = require("bcrypt")

const router = express.Router()

const userModel = require("./model/user.model")
const blogModel = require("./model/blog.model")

router.post("/home", async (req, res) => {
	try {
		const userFound = await userModel.findOne({ userName: req.body.user })
		if (userFound) {
			const hashedPass = await bcrypt.compare(
				req.body.password,
				userFound.password
			)
			if (hashedPass) {
				req.session.user = req.body.user
				res.status(201).redirect("home")
			} else{
				req.flash("error", "Invalid credentials")
				res.status(401).redirect("back")
			} 
		} else{
			req.flash("error", "Invalid credentials")
			res.status(401).redirect("back")
		} 
	} catch (err) {
		console.log(err.message)
	}
})

router.get("/home", async (req, res) => {
	try {
		if (req.session.user) {
			const blogs = await blogModel.find({})
			const len = blogs.length
			res.status(201).render("home", {
				user: req.session.user,
				blogs: blogs,
				len: len,
				message: req.flash("message"),
			})
		} else res.status(403).render("unauthorized")
	} catch (err) {
		console.log(err.message)
	}
})

router.get("/logout", (req, res) => {
	try {
		req.session.destroy()
		res.status(200).redirect("/")
	} catch (err) {
		console.log(err.message)
	}
})

router.get("/register", (req, res) => {
	try {
		let err = req.flash("error")
		if (err) res.status(400)
		else res.status(200)
		res.render("register", { duplicateError: err })
	} catch (err) {
		console.log(err.message)
	}
})

router.post("/register", async (req, res) => {
	try {
		let hashedPass = await bcrypt.hash(req.body.password, 12)
		await userModel.insertMany([
			{
				userName: req.body.user,
				name: req.body.name,
				password: hashedPass,
				email: req.body.email,
			},
		])
		req.flash("message", "User added")
		return res.status(200).send({ result: "redirect", url: "/" })
	} catch (err) {
		console.log(err.message)
		req.flash("error", "User already exists")
		return res.status(200).send({
			result: "redirect",
			url: "/route/register",
		})
	}
})

router.get("/userblogs", async (req, res) => {
	try {
		if (req.session.user) {
			let blogs = await blogModel.find({ author: req.session.user })
			res.status(200).render("userBlogs", {
				blogs: blogs,
				message: req.flash("message"),
			})
		} else {
			res.status(403).render("unauthorized")
		}
	} catch (err) {
		console.log(err.message)
	}
})

router.get("/blog", async (req, res) => {
	try {
		if (req.session.user) {
			let blog = await blogModel.find({ _id: req.query.id })
			res.render("updateBlog", { blog: blog, error: req.flash("error") })
		} else res.status(403).render("adminUnauthorized")
	} catch (err) {
		console.log(err.message)
	}
})

router.post('/blog',async (req,res)=>{
	try{
		if(req.session.user){
			await blogModel.insertMany([{heading:req.body.heading, content: req.body.content, author: req.body.user}])
			req.flash("message", "Blog added")
			res.status(200).redirect('/route/home')
		}else{
			res.status(403).render("unauthorized")
		}
	}catch(err){
		console.log(err.message);
	}
})

router.put("/blog", async (req, res) => {
	try {
		if (req.session.user) {
			await blogModel.updateOne(
				{ _id: req.body._id },
				{
					heading: req.body.heading,
					content: req.body.content,
					author: req.body.user,
				}
			)
			req.flash("message", "Blog Updated")
			return res
				.status(200)
				.send({ result: "redirect", url: "/route/userblogs" })
		} else res.status(403).render("Unauthorized")
	} catch (err) {
		console.log(err.message)
	}
})

router.delete("/blog", async (req, res) => {
	try {
		if (req.session.user) {
			await blogModel.deleteOne({ _id: req.body.blogId })
			req.flash("message", "Blog deleted")
			return res
				.status(200)
				.send({ result: "redirect", url: "/route/userblogs" })
		} else {
			res.status(403).render("Unauthorized")
		}
	} catch (err) {
		console.log(err.message)
	}
})



module.exports = router
