const express = require("express");
const router = express.Router();

router.get("/inventory",
  (req,res)=>{
  // console.log("Inventory route hit");
  res.render("inventory", {title: "Inventory"})

//   req.params.id
})

module.exports = router;