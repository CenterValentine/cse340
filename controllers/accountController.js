utilities = require('../utilities/index.js')
accountModel = require('../models/account-models.js')

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
        nav
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
let nav = await utilities.getNav();
console.log('req.body:', req.body)
const {account_firstname, account_lastname, account_email, account_password} = req.body;

const regResult = await accountModel.registerAccount(account_firstname, account_lastname, account_email, account_password);

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



module.exports = {buildLogin, buildRegister, registerAccount}