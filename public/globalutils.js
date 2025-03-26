/*
    Used for varoius javascript functions/variables that
    are helpful for multiple pages
*/

// Whether an object is empty
const isEmpty = obj => Object.keys(obj).length === 0;

// Finds the user ID cookie value
const locateID = cookie => cookie.match(/simplecmsloggedin=\d+/).substring(18, cookie.length);
