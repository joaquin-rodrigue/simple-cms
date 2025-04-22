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

            // This shouldn't happen unless the database is empty 
            // But if the database is empty something probably has gone horribly wrong so...
            if (result.length < 1) {
                return response.status(404).json({ message: "SOMETHING HAS GONE HORRIBLY WRONG OH NO" });
            }
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
        //console.log('its in the right room');
        let result = {};
        try {
            console.log(request.params.id);
            //console.log(request);
            result = await webpage.get(request.params.id, request.query);
        
            if (result.length < 1) {
                return response.status(404).json({ message: "No data was found in the database." });
            }
        }
        catch (error) {
            console.error(error);
            return response.status(500).json({ message: "Server error while querying database." });
        }
        response.json({ 'data': result });
    }
);

// POST new page
app.post('/webpage/',
    upload.none(),
    async (request, response) => {
        let result = {};
        try {
            if (typeof request.body.name !== 'string' || request.body.name.length === 0) {
                return response.status(400).json({ message: "Invalid name for webpage" });
            }
            if (typeof request.body.owner === 'undefined' || parseInt(request.body.owner) < 0) {
                return response.status(400).json({ message: "Invalid user ID for webpage" });
            }

            // I'm creating the stylesheet first so we can use its ID to link to the webpage
            await stylesheet.insert(request.body);
            console.log('waited');

            // Select the newly created stylesheet
            let theID = await stylesheet.getAll({ name: request.body.name });

            result = await webpage.insert({ ...request.body, stylesheet: theID['0'].id });

            // Create the stylesheet for this page too
        }
        catch (error) {
            console.error(error);
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
        
            if (result.length < 1) {
                return response.status(404).json({ message: "No data was found in the database." });
            }
        }
        catch (error) {
            return response.status(500).json({ message: "Server error while querying database." });
        }
        response.json({ 'data': result });
    }
);

// POST new stylesheet
app.post('/styles/',
    upload.none(),
    async (request, response) => {
        let result = {};
        try {
            if (typeof request.body.name !== 'string' || request.body.name.length === 0) {
                return response.status(400).json({ message: "Invalid name for webpage" });
            }
            if (typeof request.body.owner !== 'number' || request.body.owner < 0) {
                return response.status(400).json({ message: "Invalid user ID for webpage" });
            }

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
// Also works as a LOGIN feature
app.get('/user/:id/',
    upload.none(),
    async (request, response) => {
        let result = {};
        try {
            result = await user.get(request.id, request.query);
            
            if (result.length < 1) {
                return response.status(404).json({ message: "No data returned by database." });
            }

            // Determine if this was a login or just a user request
            if (typeof result[0].password !== 'undefined' && result[0].password.length > 0) {
                // TODO: cookies for login
                response.cookie('simplecmsloggedin', result[0].id, { maxAge: 20000000 });
            }
        }
        catch (error) {
            console.error(error);
            return response.status(500).json({ message: "Server error while querying database." });
        }
        response.json({ 'data': result });
    }
);

// POST new user
app.post('/user/',
    upload.none(),
    async (request, response) => {
        let result = {};
        try {
            console.log("body: ", request);
            let username = request.body.username;
            let password = request.body.password;
            let encryptedPassword = hash.update(password).digest('base64');
            console.log(encryptedPassword);
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

            if (result.length < 1) {
                return response.status(404).json({ message: "No data was found in the database." });
            }
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
        
            if (result.length < 1) {
                return response.status(404).json({ message: "No data was found in the database." });
            }
        }
        catch (error) {
            return response.status(500).json({ message: "Server error while querying database." });
        }
        response.json({ 'data': result });
    }
);

// POST new file
app.post('/file/',
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