const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

// if no data, skip this controller, to be moved into higher order function.
function skipControllerIfBlankResult(data, next){
    if (!data || data.length === 0) {      
    return next() 
}}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    console.log("in buildByClassificationId")
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  skipControllerIfBlankResult(data, next)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByInventoryId = async function (req, res, next) {
    console.log('in buildByInventoryId')
    const inventory_id = req.params.inventoryId     
    const data = await invModel.getInventoryByInventoryId(inventory_id)
    // if no data, skip this controller
    skipControllerIfBlankResult(data, next)
    const vehicle = data[0]
    const grid = await utilities.buildInventoryGrid(data)
    let nav = await utilities.getNav()

    const className = `${vehicle.inv_year} ${vehicle.inv_model} ${vehicle.inv_make}`
    res.render('./inventory/details.ejs', {
        title: className,
        nav,
        grid,
    })
}



invCont.buildVehicleManager = async function (req,res, next) {
  // console.log('in buildVehicleManager')
  let nav = await utilities.getNav()
  res.render("./inventory/managment.ejs", {
    title: 'Vehicle Management',
    nav
  })

}
 
  invCont.buildAddClass =  async function (req,res, next) {
    console.log('in buildAddClass')
    // const {classification_name} = req.body
    let nav = await utilities.getNav()
    // const data = await invModel.addInventoryClassByName(classification_name)
    res.render("./inventory/add-classification.ejs", {
      title: 'Add New Classification',
      nav,
      errors: null,
})
}

invCont.buildAddInv =  async function (req,res, next) {
  let nav = await utilities.getNav()
  let classDrop = await utilities.buildClassificationDropdown()
  res.render("./inventory/add-inventory.ejs", {
    title: 'Add New Inventory',
    nav,
    errors: null,
    classDrop
  })
}

/* ****************************************
*  Process Inventory
* *************************************** */
// Reminder to self: next isn't needed because pass or failure is handled!
invCont.addClass = async function(req,res){
  console.log('in addClass')
  const {classification_name} = req.body;
  const addResult = await invModel.addInventoryClassByName(classification_name)
  
  if (addResult){
    let nav = await utilities.getNav()
    req.flash('notice',`You're classification '${classification_name}' has been added to the system.`)
    res.status(201).render("inventory/managment.ejs", {
      title: "Vehicle Management",
      nav,
      errors: null,
    })
  } else {
    let nav = await utilities.getNav()
    req.flash('notice', `The classification '${classification_name}' could not be added. Please try again later.`)
    res.status(501).render("inventory/managment.ejs",{
      title:"Add New Classification",
      nav,
      errors: null,
    })
  }
}

invCont.addInv = async function(req,res){
  console.log('in addClass')
  const {classification_id,inv_make,inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color} = req.body;
  const addResult = await invModel.addInventoryItem(classification_id,inv_make,inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)
  console.log('addResult', addResult)
  if (addResult){
    let nav = await utilities.getNav()
    req.flash('notice',`The ${inv_color} ${inv_year} ${inv_make} ${inv_model} has been added successfully to inventory system.`)
    res.status(201).render("inventory/managment.ejs", {
      title: "Vehicle Management",
      nav,
      errors: null,
    })
  } else {
    let nav = await utilities.getNav()
    let classDrop = await utilities.buildClassificationDropdown(classification_id)
    req.flash('notice', `The ${inv_color} ${inv_year} ${inv_make} ${inv_model} could not be added due to a database error. Please try again later.`)
    res.status(501).render("inventory/add-inventory.ejs",{
      title:"Add New Inventory",
      nav,
      errors: null,
      classDrop,
      classification_id,
      inv_make,inv_model,
      inv_year, inv_description,
      inv_image, inv_thumbnail,
      inv_price, inv_miles,
      inv_color


    })
  }
}

module.exports = invCont
