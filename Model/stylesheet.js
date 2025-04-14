const connection = require('./connection');

// --- GET BY ID ---
async function get(id, parameters = {}) {
    let selectSql = `SELECT * FROM stylesheet WHERE id = ?`, 
    queryParameters = [id];

    return await connection.query(selectSql, queryParameters);
}

// --- INSERT ---
async function insert(parameters = {}) {
    let selectSql = `INSERT INTO stylesheet (name, owner)
                    VALUES (?, ?)`, 
    queryParameters = [parameters.name, parameters.owner];
    
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