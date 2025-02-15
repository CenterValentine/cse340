// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/index.js")
const invValidate = require('../utilities/inventory-validation.js')

router.get("/", utilities.checkLogin,
    utilities.handleErrors(invController.buildVehicleManager))

router.get("/addClass",
    utilities.checkLogin,
    utilities.handleErrors(invController.buildAddClass))
router.post("/addClass",
    utilities.checkLogin,
    invValidate.addClassRules(),
    invValidate.checkAddClassData,
    utilities.handleErrors(invController.addClass))

router.get("/addInv",
    utilities.checkLogin,
    utilities.handleErrors(invController.buildAddInv))

router.post("/addInv",
    utilities.checkLogin,
    invValidate.addInvRules(),
    invValidate.checkAddInvData,
    utilities.handleErrors(invController.addInv))

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId))

router.get("/getInventory/:classificationId", utilities.handleErrors(invController.getInventoryJSON))



router.get("/edit/:inventoryId",
    utilities.checkLogin, 
    utilities.handleErrors(invController.buildEditInv))

router.post("/update/",
    invValidate.addInvRules(),
    invValidate.checkAddInvData,
    utilities.handleErrors(invController.updateEditInv))


module.exports = router;