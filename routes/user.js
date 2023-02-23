const express = require('express');
const router = express.Router();
const db = require('../database/db');

router.post('/login', (req, res) => {
    const { user } = db;
    const { login, password } = req.body;

    console.log({ login, password });

    res.status(201);
    res.json(user);
});


module.exports = router;