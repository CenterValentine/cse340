// const express = require("express");




function getNav(){
    return null
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
const handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch( err=>  {
    console.error(err);
    next(err)});

module.exports = {getNav, handleErrors}