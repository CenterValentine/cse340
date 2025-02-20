const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/index.js");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

console.log("in accountRoute.js");

router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccount)
);
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);
router.get("/logout", utilities.handleErrors(accountController.accountLogout));
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);
// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

router.get(
  "/admin",
  utilities.checkOwnership,
  utilities.handleErrors(accountController.buildAdminPanel)
);

router.post(
  "/admin",
  (req, res, next) => {
    console.log("in admin route");
    console.log("req.body: ", req.body);
    console.log("req.params: ", req.params);
    console.log("req.query: ", req.query);
    next();
  },
  regValidate.adminUpdateRules(),
  regValidate.checkadminUpdate,
  utilities.handleErrors(accountController.processAdminPanel)
)

router.get(
  "/edit/:accountId",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildEditAccount)
);

router.post(
  "/update",
  utilities.checkLogin,
  regValidate.editAccountRules(),
  regValidate.checkAccountData,
  utilities.handleErrors(accountController.updateAccountInfo)
);

router.post(
  "/update/password",
  utilities.checkLogin,
  regValidate.accountPasswordRules(),
  regValidate.checkAccountPassword,
  utilities.handleErrors(accountController.updateAccountPassword)
);

module.exports = router;
