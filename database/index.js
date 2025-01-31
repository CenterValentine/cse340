const { Pool } = require("pg")
require("dotenv").config()

function toggleQueryConsole( message, object) {
  if (false) {
    console.log(message, {object} )
  }
  else {
    console.log("DB query fired and console is off")
  }


}
/* ***************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * If - else will make determination which to use
 * *************** */
let pool
if (process.env.NODE_ENV == "development") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
})

// Added for troubleshooting queries
// during development
module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params)
      toggleQueryConsole("executed query", { text, params })
      // console.log("executed query", { text })

      return res
    } catch (error) {
      toggleQueryConsole(
        "error in query",
        { text, params, error: error.message }
      )
      // console.error("error in query", { text })
      throw error
    }
  },
}
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })
  module.exports = pool
}