const accountModel = require("../models/account-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the database
body("account_email")
.trim()
.isEmail()
.normalizeEmail() // refer to validator.js docs
.withMessage("A valid email is required.")
.custom(async (account_email) => {
  const emailExists = await accountModel.checkExistingEmail(account_email)
  console.log('EmailExists: ',emailExists)
  if (emailExists){
    throw new Error("Email exists. Please log in or use different email")
  }
}),
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }


validate.loginRules = () => {
    return [
        //email is required and cannot already exist in the database
        body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("Please check your credentials and try again.")
        .custom(async (account_email) => {
          console.log("account_email:", account_email)
        const emailExists = await accountModel.checkExistingEmail(account_email)

        if (emailExists.rowCount){
            throw new Error("Please check your credentials and try again..")
        }
}),
   // password is required and must be strong password
   body("account_password")
   .trim()
   .notEmpty()
   .isStrongPassword({
     minLength: 12,
     minLowercase: 1,
     minUppercase: 1,
     minNumbers: 1,
     minSymbols: 1,
   })
   .withMessage("A valid email or password is required. (Password)"),
    ]
}

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    console.log("errors:", errors)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }

validate.checkLoginData = async (req, res, next) => {
    const { account_email} = req.body
    let error = []
    errors = validationResult(req)
    // console.log("errors: ", errors)
    if(!errors.isEmpty()){
        let nav = await utilities.getNav()
        res.render("account/login", {
            title: "Login",
            nav,
            errors,
            account_email,
        })
    }
    next()

}

validate.editAccountRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the database
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required."),
  ]
}

validate.checkAccountData = async (req, res, next) => {
  const user = req.body
  console.log("user:", user)
  let errors = []
  errors = validationResult(req)
  console.log("errors:", errors)
  if(!errors.isEmpty()){
    let nav = await utilities.getNav()
    res.render("account/edit", {
      errors,
      title: "Edit Account Details",
      nav,
      user: res.locals.user,
    })
    return
  }
  next()
}


validate.accountPasswordRules = () => {
  return [
    // password is required and must be strong password
    body("account_password")
    .trim()
    .notEmpty()
    .isStrongPassword({
      minLength: 12,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("Password does not meet requirements."),
  ]
}
  
validate.checkAccountPassword = async (req, res, next) => {
  let errors = []
  errors = validationResult(req)
  if(!errors.isEmpty()){
    let nav = await utilities.getNav()
    res.render("account/edit.ejs", {
      errors,
      title: "Edit Account Details",
      nav,
      user: res.locals.user,
    })
    return
  }
  next()

}

  module.exports = validate