const express = require('express');
const fs = require('fs');
const path = require('path');
const db = require('../database/db');
const Book = require('../models/Book');
const { UPLOADED_FILE_PATH } = require('../constants');
const fileMulter = require('../middleware/file');

const router = express.Router();

router.get('/', (req, res) => {
    const { books } = db;

    res.json(books);
});

router.get('/:id', (req, res) => {
    const { books } = db;
    const { id } = req.params;
    const [book = null] = books.filter(item => item.id === id);

    if (book) {
        return res.json(book);
    }

    res.status(404);
    res.json('[Book] - page not found');
});

router.post('/', fileMulter, (req, res) => {
    const { books } = db;
    const { 
        title = null,
        description = null,
        authors = null,
        favorite = null,
        fileCover = null,
        fileName = null,
    } = req.body;

    const fileBook = req.file ? req.file.filename : null;
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

    res.status(201);
    res.json(newBook);
});

router.get('/:id/download', (req, res) => {
    const { id } = req.params;
    const { books } = db;
    const idx = books.findIndex(item => item.id === id)

    if (idx >= 0) {
        const fileName = books[idx].fileBook;
        if (!fileName) {
            res.status(404);
            res.json('[Book] - file not found');
        }

        const filePath = path.join(UPLOADED_FILE_PATH, books[idx].fileBook);
        const fileExists = fs.existsSync(filePath);

        if (fileExists) return res.download(filePath);

        res.status(404);
        res.json('[Book] - file not found');
    }

    res.status(404);
    res.json('[Book] - page not found');
});

router.put('/:id', (req, res) => {
    const { books } = db;
    const { id } = req.params;
    const { 
        title = null,
        description = null,
        authors = null,
        favorite = null,
        fileCover = null,
        fileName = null,
     } = req.body;

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
        }
        return res.json(books[idx]);
     }

     res.status(404);
     res.json('[Book] - page not found');
});

router.delete('/:id', (req, res) => {
    const { books } = db;
    const { id } = req.params;
    const idx = books.findIndex(item => item.id === id);

    if (idx >= 0) {
        books.splice(idx, 1);
        return res.json('ok');
    }

    res.status(404);
    res.json('[Book] - page not found');
});

module.exports = router;