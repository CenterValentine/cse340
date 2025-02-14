const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/index.js")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')


router.get("/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccount))
router.get("/login",utilities.handleErrors(accountController.buildLogin))
router.get("/register", utilities.handleErrors(accountController.buildRegister))
// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

  router.post(
    "/login", 
    (req, res, next) => {
      console.log("Raw req.body:", req.body);
      // console.log("Request Body Keys:", Object.keys(req.body));
      next();
    },
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
  )

module.exports = router;