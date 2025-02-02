// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/index.js")
const invValidate = require('../utilities/inventory-validation.js')

console.log("inventoryRoute.js accessed")

router.get("/",utilities.handleErrors(invController.buildVehicleManager))

router.get("/addClass",utilities.handleErrors(invController.buildAddClass))
router.post("/addClass",
    invValidate.addClassRules(),
    invValidate.checkAddClassData,
    utilities.handleErrors(invController.addClass))

router.get("/addInv",utilities.handleErrors(invController.buildAddInv))
router.post("/addInv",(req,res,next)=>{ console.log("in addInv post"); next()},
    invValidate.addInvRules(),
    invValidate.checkAddInvData,
    utilities.handleErrors(invController.addInv))

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId))

module.exports = router;