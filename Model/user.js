const connection = require('./connection');

// --- GET USER ---
async function get(id, parameters = {}) {
    let selectSql = `SELECT *
                    FROM user
                    WHERE id = ${id}`, 
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

module.exports = { get, insert, edit, remove };