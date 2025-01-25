
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
const inventory = require("./routes/inventory")

const utilities = require("./utilities/index.js")


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
app.use("/inventory", inventory)

app.get("/", utilities.handleErrors((req,res) => 
  {res.render("index", {title: "Home"})}
))

app.get("/inventory", inventory

)

app.get('/favicon.ico', (req, res) => {
  // WWWHHHHYY does this get called??!
  // console.log("Favicon request detected");
  res.status(204).end(); // No content
});


app.use(async (req, res, next) => {
  next({status: 404,
     message: "Sorry, we've had a fender bender... "
    })
})


/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message: err.message,
    nav
  })
})


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
