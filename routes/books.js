const express = require('express');
const fs = require('fs');
const path = require('path');
const db = require('../database/db');
const Book = require('../models/Book');
const { UPLOADED_FILE_PATH, COUNTER_SERVICE } = require('../constants');
const fileMulter = require('../middleware/file');

const router = express.Router();
const axios = require('axios');

router.get('/', (req, res) => {
    const { books } = db;
    res.render('index', { books });
});

router.get('/create', (req, res) => {
    res.render('create');
});

router.get('/:id', async (req, res) => {
    const { books } = db;
    const { id } = req.params;
    const [book = null] = books.filter(item => item.id === id);

    if (book) {
        await axios.post(`${COUNTER_SERVICE}counter/${id}/inc`, {}).catch(err => console.log(err));
        const counter = await axios.get(`${COUNTER_SERVICE}counter/${id}`).catch(() => 0);
        
        return res.render('view', { book, counter: counter.data });
    }

    res.status(404);
    res.render('not-found');
});

router.post('/create', fileMulter, (req, res) => {
    const { books } = db;
    const { 
        title = null,
        description = null,
        authors = null,
        favorite = null,
        fileCover = null,
    } = req.body;

    const fileBook = req.file ? req.file.filename : null;
    const fileName = req.file ? req.file.originalname : null;
    const newBook = new Book(
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName,
        fileBook
    );

    books.push(newBook);

    res.redirect(`${newBook.id}`);
});

router.get('/:id/download', (req, res) => {
    const { id } = req.params;
    const { books } = db;
    const idx = books.findIndex(item => item.id === id)

    if (idx >= 0) {
        const fileName = books[idx].fileBook;
        if (!fileName) {
            res.status(404);
            res.render('not-found');
        }

        const filePath = path.join(UPLOADED_FILE_PATH, books[idx].fileBook);
        const fileExists = fs.existsSync(filePath);

        if (fileExists) return res.download(filePath, books[idx].fileName);

        res.status(404);
        res.render('not-found');
    }

    res.status(404);
    res.json('[Book] - page not found');
});

router.get('/:id/edit', (req, res) => {
    const { books } = db;
    const { id } = req.params;
    const [book = null] = books.filter(item => item.id === id);

    if (book) {
        return res.render('update', { book })
    }

    res.status(404);
    res.render('not-found');
});

router.post('/:id/edit', fileMulter, (req, res) => {
    const { books } = db;
    const { id } = req.params;
    const { 
        title = null,
        description = null,
        authors = null,
        favorite = null,
        fileCover = null,
     } = req.body;

     const fileBook = req.file ? req.file.filename : null;
     const fileName = req.file ? req.file.originalname : null;

     console.log({fileBook});

     const idx = books.findIndex(item => item.id === id);

     if (idx >= 0) {
        books[idx] = {
            ...books[idx],
            title: title ?? books[idx].title,
            description: description ?? books[idx].description,
            authors: authors ?? books[idx].authors,
            favorite: favorite ?? books[idx].favorite,
            fileCover: fileCover ?? books[idx].fileCover,
            fileName: fileName ?? books[idx].fileName,
            fileBook: fileBook ?? books[idx].fileBook,
        }
        return res.redirect(`/${id}`);
     }

     res.status(404);
     res.render('not-found');
});

router.post('/:id/delete', (req, res) => {
    const { books } = db;
    const { id } = req.params;
    const idx = books.findIndex(item => item.id === id);

    if (idx >= 0) {
        books.splice(idx, 1);
        return res.redirect('/');
    }

    res.status(404);
    res.render('not-found');
});

module.exports = router;