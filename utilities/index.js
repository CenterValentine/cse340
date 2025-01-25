const invModel = require("../models/inventory-model")
const Util = {}



/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    // console.log(data)
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
      list += "<li>"
      list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>"
      list += "</li>"
    })
    list += "</ul>"
    return list
  }
  

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }


/* **************************************
* Build the inventory view HTML
* ************************************ */

Util.buildInventoryGrid = async function(data){
    let grid

    console.log("data length", data.length)
    let vehicle = data[0]

    switch (data.length) {
        case 0:
            grid = `<p>Sorry, we can't find any matching vehicles could be found.</p>`
            break
        case 1:
            // grid = '<div><h1>' + vehicle.inv_model + ' ' + vehicle.inv_make + '</h1><div class="inv__details">'+ vehicle.inv_model + ' ' + vehicle.inv_make + '</div></div>'
            grid = `<div>
            <div class="inv__image">
                <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_color} ${vehicle.inv_make} ${vehicle.inv_model}>
            </div>
            <div class="inv__details"> 
                <h2> ${vehicle.inv_model} ${vehicle.inv_make} details</h2>
                <div class="inv__details-content">
                Price: ${vehicle.inv_price}
                Miles: ${vehicle.inv_miles}
                Color: ${vehicle.inv_color}
                Description: ${vehicle.inv_description}
                </div>
            </div>
            </div>`
            break
        default:
            grid = '<p>Sorry, no matching vehicles could be found.</p'
    }
    return grid

}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch( err=>  {
    console.error(err);
    next(err)});


module.exports = Util
