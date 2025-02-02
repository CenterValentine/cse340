const bcrypt = require("bcryptjs")

utilities = require('../utilities/index.js')
accountModel = require('../models/account-model.js')

/* ****************************************
*  Deliver login view
* *************************************** */

async function buildLogin(req, res, next) {
let nav = await utilities.getNav();
res.render('./account/login.ejs', {
    title: 'Login',
    nav: nav,
})
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
let nav = await utilities.getNav();
    res.render('account/register.ejs', {
        title: 'Register',
        nav,
        errors: null,
    })
}


/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
let nav = await utilities.getNav()
console.log('req.body:', req.body)
const {account_firstname, account_lastname, account_email, account_password} = req.body;

// Hash the password before storing
let hashedPassword
try {
  // regular password and cost (salt is generated automatically)
  hashedPassword = await bcrypt.hashSync(account_password, 10)
} catch (error) {
  req.flash("notice", 'Sorry, there was an error processing the registration.')
  res.status(500).render("account/register", {
    title: "Registration",
    nav,
    errors: null,
  })
}

const regResult = await accountModel.registerAccount(account_firstname, account_lastname, account_email, hashedPassword)

if (regResult) {
    req.flash('notice', `Congratulations, you\'re registered ${account_firstname}.  Please log in.`)
    res.status(201).render("account/login.ejs", {
    title:"Login",
    nav
    })
} else {
    req.flash('notice', `Sorry, the registration failed.`)
    res.status(501).render("account/register.ejs", {
        title:"Registration",
        nav,})
}
}

/* ****************************************
*  Process Login
* *************************************** */
async function loginAccount(req,res) {

}

module.exports = {buildLogin, buildRegister, registerAccount, buildRegister}