const connection = require('./connection');
const sqlString = require('sqlstring');
// https://stackoverflow.com/questions/27970431/using-sha-256-with-nodejs-crypto
const crypto = require('crypto');
const hash = crypto.createHash('sha256');

// --- GET USER ---
async function get(id, parameters = {}) {
    let selectSql = '',
    where = [],
    queryParameters = [];

    // id; optional
    if (typeof parameters.id !== 'undefined' && parseInt(parameters.id) > -1) {
        where.push(`id = ?`);
        queryParameters.push(sqlString.escape(parameters.id));
    }
    // username
    if (typeof parameters.username !== 'undefined' && parameters.username.length > 0) {
        where.push(`username = ?`);
        queryParameters.push(sqlString.escape(parameters.username));
    }
    // password
    if (typeof parameters.password !== 'undefined' && parameters.password.length > 0) {
        let encryptedPassword = crypto.createHash('sha256').update(parameters.password).digest('base64');
        where.push(`password = ?`);
        queryParameters.push(encryptedPassword);
    }

    // To prevent user passwords from getting leaked
    if (typeof parameters.password !== 'undefined' && parameters.password.length > 0) {
        selectSql = 'SELECT * FROM user';
    }
    else {
        selectSql = 'SELECT id, username FROM user';
    }

    // Add together
    if (where.length > 0) {
        selectSql += ` WHERE ${where.join(' AND ')}`;
    }
    console.log(selectSql);

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

module.exports = { get, insert, edit, remove };