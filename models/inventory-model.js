const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

// module.exports = {getClassifications}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
        [classification_id]
      )
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error)
    }
  }

  async function getInventoryByInventoryId(inv_id){
    try {
        const data = await pool.query(
            `
            SELECT * FROM public.inventory AS i
            WHERE i.inv_id = $1`,
            [inv_id]
        )
        return data.rows
    } catch (error) {
        console.error("getInventoryByInventoryId error " + error)
    }
  }

  async function addInventoryClassByName(inv_class){
    try {
      const data = await pool.query(`
        INSERT INTO public.classification (classification_name)
        VALUES ($1)`,
      [inv_class])
      return data.rows
    }
    catch (error) {
      console.error("addInventoryClassByName error " + error)
    }
  }


async function addInventoryItem(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color){
try {
  const data = await pool.query(`
    INSERT INTO inventory (classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color]
  )
  return data.rows
} catch (error) {
  console.error("addInventoryItem error " + error)
}
}

/* **********************
 *   Check for existing class
 * ********************* */

async function checkExistingClass(classification_name){
  try {
    sql = "SELECT * FROM public.classification WHERE classification_name = $1"  
    return await pool.query (sql,[classification_name])
  } catch (error) {
    console.error("checkExistingClass error " + error)
    return error.message
  }
}

module.exports = { getClassifications, getInventoryByClassificationId, getInventoryByInventoryId, addInventoryClassByName, checkExistingClass, addInventoryItem}