const { v4: uuid } = require('uuid');

module.exports = class Book {
    constructor(
        id = uuid(),
        title = null,
        description = null,
        authors = null,
        favorite = null,
        fileCover = null,
        fileName = null,
        fileBook = null,
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.authors = authors;
        this.favorite = favorite;
        this.fileCover = fileCover;
        this.fileName = fileName;
        this.fileBook = fileBook;
    }
}