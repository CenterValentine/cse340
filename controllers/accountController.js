const bcrypt = require("bcryptjs")

const jwt = require("jsonwebtoken")
require("dotenv").config()


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
    errors: null,
})
}


/* ****************************************
 *  Process logout request
 * ************************************ */

async function accountLogout(req, res) {
  res.clearCookie("jwt")
  res.locals.loggedin = 0
  res.locals.user = ''
  req.flash("notice", "You are now logged out.")
  res.redirect("/account/login")
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
let nav = await utilities.getNav()
    res.render('account/register.ejs', {
        title: 'Register',
        nav,
        errors: null,
    })
}

/* ****************************************
*  Deliver account view
* *************************************** */

async function buildAccount(req, res, next) {
let nav = await utilities.getNav();
console.log('res.locals:', res.locals)
res.render('account/account.ejs', {
    title: 'Account Management',
    nav: nav,
    errors: null,
    user: res.locals.user,

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
    nav,
    errors: null,
    })
} else {
    req.flash('notice', `Sorry, the registration failed.`)
    res.status(501).render("account/register.ejs", {
        title:"Registration",
        nav,})
}
}


/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const user = await accountModel.getAccountByEmail(account_email)
  if (!user) {
    req.flash("notice", "Please check your credentials and try again...")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, user.account_password)) {
      delete user.account_password
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })

      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again....")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden:' + error)
  }
}



async function buildEditAccount(req, res, next){
  console.log('in buildEditAccount')
  let nav = await utilities.getNav()
  const userId = req.params.accountId
  const data = await accountModel.getAccountById(userId)
  console.log('buildEditAccount data:', data)
  res.render('account/edit.ejs', {
      title: 'Edit Account Details',
      nav: nav,
      errors: null,
      user: data,
      
})}

async function updateAccountInfo(req, res, next){
  console.log('in updateAccount')
  const {account_id, account_firstname, account_lastname, account_email} = req.body
  let nav = await utilities.getNav()
  const result = await accountModel.updateAccountInfo(account_id, account_firstname, account_lastname, account_email)
  if(result){

  req.flash("notice", "Your account information has been updated."),
  res.render("account/account.ejs",{
    title: 'Account Management',
    nav: nav,
    errors: null,
    user: res.locals.user
  })
    } else {
      req.flash("notice", "Sorry, the update failed.")
    res.status(501).render('account/edit.ejs', {
      title: 'Edit Account Details',
      nav: nav,
      errors: result.message,
      user: res.locals.user
  })
}
}


async function updateAccountPassword(req, res, next){
  console.log('in updateAccountPassword')
  const {account_id, account_password} = req.body
  let nav = await utilities.getNav()
  let hashedPassword
try {
  // regular password and cost (salt is generated automatically)
  hashedPassword = await bcrypt.hashSync(account_password, 10)
} catch (error) {
  req.flash("notice", 'Sorry, there was an error processing the password update.')
  res.status(500).render("account/edit.ejs", {
    title: "Edit Account Details",
    nav,
    errors: null,
    user: res.locals.user,
  })
}

const updateResult = await accountModel.updateAccountPassword(hashedPassword, account_id)
console.log('updateResult:', updateResult)
if (updateResult) {
  req.flash('notice', `You\'re account password was succesfully updated.`)
  res.status(201).render("account/account.ejs", {
    title:"Account Management",
    nav,
    errors: null,
    user: res.locals.user,
    })
} else {
  req.flash('notice', `Sorry, the password update failed.`)
    res.status(501).render("account/edit.ejs", {
        title:"Edit Account Details",
        nav,
        errors: null,
        user: res.locals.user,
      })
}
}

async function buildAdminPanel(req, res, next){
  let nav = await utilities.getNav()
  const tableData = await accountModel.getAllAccounts()
  console.log("in buildAdminPanel")
  res.render('account/admin.ejs', {
      title: 'Admin Panel',
      nav: nav,
      errors: null,
      user: res.locals.user,
      tableData: tableData
  })
  next()
}

module.exports = {buildRegister, registerAccount, buildLogin, accountLogin, accountLogout, buildAccount, buildEditAccount, updateAccountInfo, updateAccountPassword,buildAdminPanel }