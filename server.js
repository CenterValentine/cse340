
/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute.js")
const utilities = require("./utilities/index.js")
const catchErrorsRoute = require("./routes/errorRoute.js")


/* ***********************
 * View Engine and Templates
 *************************/

app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root - sets layout filespace

/* ***********************
 * Routes
 *************************/
app.use(static)

app.get("/", utilities.handleErrors(baseController.buildHome))

app.use("/inv", inventoryRoute)

// app.get("/", utilities.handleErrors((req,res) => 
//   {res.render("index", {title: "Home"})}
// ))

/* ****************************************
 * Middleware For Handling Errors
 * Do not place anything after this.
 * wrap utilities.handleErrors for General Error Handling
 **************************************** */
app.use(catchErrorsRoute);

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST


/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
