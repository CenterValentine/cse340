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
    console.log("in buildByInventoryId")
    const inventory_id = req.params.inventoryId     
    const data = await invModel.getInventoryByInventoryId(inventory_id)
    // if no data, skip this controller
    skipControllerIfBlankResult(data, next)
    const vehicle = data[0]
    const grid = await utilities.buildInventoryGrid(data)
    let nav = await utilities.getNav()

    const className = `${vehicle.inv_year} ${vehicle.inv_model} ${vehicle.inv_make}`
    res.render("./inventory/details.ejs", {
        title: className,
        nav,
        grid,
    })
}

module.exports = invCont
