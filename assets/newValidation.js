const uname = document.querySelector("#user")
const name1 = document.querySelector("#name")
const email = document.querySelector("#email")
const password = document.querySelector("#password")
const submitbtn = document.querySelector("#submit")

const nameError = document.querySelector("#nameError")
const uNameError = document.querySelector("#uNameError")
const emailError = document.querySelector("#emailError")
const passwordError = document.querySelector("#passwordError")

let validate = [1,1,1,1]

const regname = /^[a-zA-Z][a-zA-Z][a-zA-Z ]*$/
const regmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

submitbtn.addEventListener("click", () => {
	if (uname.value == "") {
		uNameError.textContent = "Provide a user name"
	}
	if (name1.value == "") {
		nameError.textContent = "Provide your name"
	}
	if (email.value == "") {
		emailError.textContent = "Provide your email"
	}
	if (password.value == "") {
		passwordError.textContent = "Create a password"
	}
})

uname.addEventListener("focusout", () => {
	if (uname.value == "") {
		uNameError.textContent = "Provide a user name"
        validate[0] = 0
	} else if (uname.value.match(regname) != uname.value) {
		uNameError.textContent = "Provide a proper name"
        validate[0] = 0
	} else {
		uNameError.textContent = ""
		validate[0] = 1
	}
})

email.addEventListener("focusout", () => {
	if (email.value == "") {
		emailError.textContent = "Provide your email"
        validate[1] = 0
	} else if (email.value.match(regmail) != email.value) {
		emailError.textContent = "Provide a proper Email" 
        validate[1] = 0
	} else {
		emailError.textContent = ""
		validate[1] = 1
	}
})

name1.addEventListener("focusout", () => {
	if (name1.value == "") {
		nameError.textContent = "Provide your name"
        validate[2] = 0
	} else if (name1.value.length < 3) {
		nameError.textContent = "provide a proper name"
        validate[2] = 0
	} else {
		nameError.textContent = ""
		validate[2] = 1
	}
})

password.addEventListener("focusout", () => {
	if (password.value == "") {
		passwordError.textContent = "Create a password"
        validate[3] = 0
	} else if (password.value.length < 6) {
		passwordError.textContent = "Atleast 6 charecters required"
        validate[3] = 0
	} else {
		passwordError.textContent = ""
		validate[3] = 1
	}
})

$("#submit-form").submit((e) => {
	let sum = validate.reduce(function (a, b) {
		return a + b
	}, 0)
	console.log("in ajax")
	console.log(sum)
	e.preventDefault()
	if (sum == 4) {
		sum = 0
		// validate = [0, 0, 0, 0]
		$.ajax({
			url: "/route/adduser",
			data: $("#submit-form").serialize(),
			method: "post",
			success: function (response) {
				if (response.result == "redirect") {
					window.location.replace(response.url)
				}
			},
			error: function (err) {
				console.log(err.message)
			},
		})
	}
})
