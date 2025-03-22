// --- Libraries ---
const path = require('path');
const express = require('express');
const multer = require('multer');
const { check, checkSchema, validationResult } = require('express-validator');

const webpage = require("./Model/webpage");
const stylesheet = require("./Model/stylesheet");
const file = require("./Model/file");
const user = require("./Model/user");

// --- Setup defaults for multer/express middleware ---
const app = express();
app.use(express.static('public'));
const storage = multer.diskStorage({
    destination: function(request, file, callback) {
        callback(null, 'uploads/');
    },
    filename: function (request, file, callback) {
        callback(null, path.parse(file.originalname).name + '-' + Date.now() + path.parse(file.originalname).ext)
    }
});
const upload = multer({
    storage: storage,
    fileFilter: (request, file, callback) => {
        const allowedFileMimeTypes = ["image/png", "image/jpg", "image/jpeg"];
        callback(null, allowedFileMimeTypes.includes(file.mimetype));
    }
});
// --- Port number ---
const port = 80;

// --- WEBPAGES ---
// GET all pages
app.get('/webpage/',
    upload.none(),
    async (request, response) => {
        let result = {};
        try {
            
            result = await webpage.getAll(request.query);
        }
        catch (error) {
            return response.status(500).json({ message: "Server error while querying database." });
        }
        response.json({ 'data': result });
    }
);

// GET page by id
app.get('/webpage/:id/',
    upload.none(),
    async (request, response) => {
        let result = {};
        try {
            result = await webpage.get(request.id, request.query);
        }
        catch (error) {
            return response.status(500).json({ message: "Server error while querying database." });
        }
        response.json({ 'data': result });
    }
);

// POST new page
app.post('/webpage/:id/',
    upload.none(),
    async (request, response) => {
        let result = {};
        try {
            result = await webpage.insert(request.id, request.query);
        }
        catch (error) {
            return response.status(500).json({ message: "Server error while querying database." });
        }
        response.json({ 'data': result });
    }
);

// PUT webpage
app.put('/webpage/:id/',
    upload.none(),
    async (request, response) => {
        let result = {};
        try {
            result = await webpage.edit(request.id, request.query);
        }
        catch (error) {
            return response.status(500).json({ message: "Server error while querying database." });
        }
        response.json({ 'data': result });
    }
);

// DELETE webpage
app.delete('/webpage/:id/',
    upload.none(),
    async (request, response) => {
        let result = {};
        try {
            result = await webpage.delete(request.id, request.query);
        }
        catch (error) {
            return response.status(500).json({ message: "Server error while querying database." });
        }
        response.json({ 'data': result });
    }
);

// --- STYLESHEETS ---
// GET stylesheets (no need to get all at once)
app.get('/styles/:id/',
    upload.none(),
    async (request, response) => {
        let result = {};
        try {
            result = await stylesheet.get(request.id, request.query);
        }
        catch (error) {
            return response.status(500).json({ message: "Server error while querying database." });
        }
        response.json({ 'data': result });
    }
);

// POST new stylesheet
app.post('/styles/:id/',
    upload.none(),
    async (request, response) => {
        let result = {};
        try {
            result = await stylesheet.insert(request.id, request.query);
        }
        catch (error) {
            return response.status(500).json({ message: "Server error while querying database." });
        }
        response.json({ 'data': result });
    }
);

// PUT stylesheet
app.put('/styles/:id/',
    upload.none(),
    async (request, response) => {
        let result = {};
        try {
            result = await stylesheet.edit(request.id, request.query);
        }
        catch (error) {
            return response.status(500).json({ message: "Server error while querying database." });
        }
        response.json({ 'data': result });
    }
);

// DELETE stylesheet
app.delete('/styles/:id/',
    upload.none(),
    async (request, response) => {
        let result = {};
        try {
            result = await stylesheet.delete(request.id, request.query);
        }
        catch (error) {
            return response.status(500).json({ message: "Server error while querying database." });
        }
        response.json({ 'data': result });
    }
);

// --- USERS ---
// GET user (no option to get all because that doesn't seem necessary)
app.get('/user/:id/',
    upload.none(),
    async (request, response) => {
        let result = {};
        try {
            console.log(request.params);
            result = await user.get(request.id, request.query);
        }
        catch (error) {
            return response.status(500).json({ message: "Server error while querying database." });
        }
        response.json({ 'data': result });
    }
);

// LOGIN user
// TODO
app.get('/user/:username/:password/',
    upload.none(),
    async (request, response) => {
        let result = {};
        try {
            console.log(request.params);
            let username = request.params.username;
            let password = request.params.password;
            let encryptedPassword;
            let query = `WHERE username=${username}, password=${encryptedPassword}`;
            result = await user.get(request.id, query);
        }
        catch (error) {
            return response.status(500).json({ message: "Server error while querying database." });
        }
        response.json({ 'data': result });
    }
)

// POST new user
app.post('/user/:id/',
    upload.none(),
    async (request, response) => {
        let result = {};
        try {
            result = await user.insert(request.id, request.query);
        }
        catch (error) {
            return response.status(500).json({ message: "Server error while querying database." });
        }
        response.json({ 'data': result });
    }
);

// PUT user
app.put('/user/:id/',
    upload.none(),
    async (request, response) => {
        let result = {};
        try {
            result = await user.edit(request.id, request.query);
        }
        catch (error) {
            return response.status(500).json({ message: "Server error while querying database." });
        }
        response.json({ 'data': result });
    }
);

// DELETE user
app.delete('/styles/:id/',
    upload.none(),
    async (request, response) => {
        let result = {};
        try {
            result = await user.delete(request.id, request.query);
        }
        catch (error) {
            return response.status(500).json({ message: "Server error while querying database." });
        }
        response.json({ 'data': result });
    }
);

// --- FILES ---
// GET all files
app.get('/file/',
    upload.none(),
    async (request, response) => {
        let result = {};
        try {
            result = await file.getAll(request.query);
        }
        catch (error) {
            return response.status(500).json({ message: "Server error while querying database." });
        }
        response.json({ 'data': result });
    }
);

// GET file by id
app.get('/file/:id/',
    upload.none(),
    async (request, response) => {
        let result = {};
        try {
            result = await file.get(request.id, request.query);
        }
        catch (error) {
            return response.status(500).json({ message: "Server error while querying database." });
        }
        response.json({ 'data': result });
    }
);

// POST new file
app.post('/file/:id/',
    upload.none(),
    async (request, response) => {
        let result = {};
        try {
            result = await file.insert(request.id, request.query);
        }
        catch (error) {
            return response.status(500).json({ message: "Server error while querying database." });
        }
        response.json({ 'data': result });
    }
);

// PUT file
app.put('/file/:id/',
    upload.none(),
    async (request, response) => {
        let result = {};
        try {
            result = await file.edit(request.id, request.query);
        }
        catch (error) {
            return response.status(500).json({ message: "Server error while querying database." });
        }
        response.json({ 'data': result });
    }
);

// DELETE file
app.delete('/file/:id/',
    upload.none(),
    async (request, response) => {
        let result = {};
        try {
            result = await file.delete(request.id, request.query);
        }
        catch (error) {
            return response.status(500).json({ message: "Server error while querying database." });
        }
        response.json({ 'data': result });
    }
);

// --- Start server ---
app.listen(port, () => {
    console.log(`Server started; listening at http://localhost:${port}`);
});