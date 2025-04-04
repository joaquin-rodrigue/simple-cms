const connection = require('./connection');
const sqlString = require('sqlstring');

// --- GET ALL ---
// I imagine this won't have a lot of search functionality; plus I imagine
// my scope is already huge so other search functionality needed here will
// be an exercise for a later date
// Second note: I'm only really seeing a need to add one more search parameter
// for page content. That's about it, anything more complex is definitely
// overkill and an exercise for a later date
// (I am *slightly* concerned that using a LIKE %something% for the entire
// page content is going to be horrible for performance though...)
async function getAll(parameters = {}) {
    let selectSql = `SELECT * FROM webpage`, 
    where = [],
    orderBy = [],
    queryParameters = [];

    // name
    if (typeof parameters.name !== 'undefined' && parameters.name.length > 0) {
        where.push('name LIKE ?');
        queryParameters.push(`%${parameters.name}%`);
    }
    // content
    if (typeof parameters.body !== 'undefined' && parameters.body.length > 0) {
        where.push('body LIKE ?');
        queryParameters.push(`%${parameters.body}%`);
    }
    // owner
    // I'm not sure if sqlString.escape() is necessary if someone tries to escape the number field, it's going throuhg a parseInt call so I would assume its fine
    if (typeof parameters.owner !== 'undefined' && parseInt(parameters.owner) > -1) {
        where.push('owner = ?');
        queryParameters.push(parameters.owner);
    }
    // sorting
    if (typeof parameters.sort !== 'undefined') {
        orderBy.push(`${sqlString.escape(parameters.sort)} ${sqlString.escape(parameters.order)}`);
    }

    // Add statements together
    if (where.length > 0) {
        selectSql += ` WHERE ${where.join(' AND ')}`;
    }
    if (orderBy.length > 0) {
        selectSql += ` ORDER BY ${orderBy.join(', ')}`;
    }
    if (typeof parameters.limit !== 'undefined' && parseInt(parameters.limit) > 0) {
        selectSql += ` LIMIT ${parameters.limit}`;
    }

    console.log(selectSql);
    console.log(queryParameters);
    return await connection.query(selectSql, queryParameters);
}

// --- GET BY ID ---
// much easier because we're getting only one thing so can't do much
// with anything else regardless
async function get(id, parameters = {}) {
    let selectSql = `SELECT *
                    FROM webpage
                    WHERE id = ${sqlString.escape(id)}`, 
    queryParameters = [];

    return await connection.query(selectSql, queryParameters);
}

// --- INSERT ---
async function insert(parameters = {}) {
    let selectSql = ``, queryParameters = [];
    return await connection.query(selectSql, queryParameters);
}

// --- EDIT ---
async function edit(id, parameters = {}) {
    let selectSql = ``, queryParameters = [];
    return await connection.query(selectSql, queryParameters);
}

// --- REMOVE ---
async function remove(id, parameters = {}) {
    let selectSql = ``, queryParameters = [];
    return await connection.query(selectSql, queryParameters);
}

module.exports = { getAll, get, insert, edit, remove };