const book = {
    type: 'object',
    properties: {
        title: { type: 'string' },
        author: { type: 'string' },
        isbn: { type: 'string' },
        published_year: { type: 'number' }

    }
}

const bookNotFoundResponse={
    type: 'object',
    properties:{
        statusCode: {type: 'integer'},
        error: { type: 'string'},
        message: {type: 'string'}
    },
    example: {
        statusCode: 404,
        error: "Not Found",
        message: "The book you r are looking for does not exist"
    }
}

const getBookOpts={
    response:{
        200: book,
        404: bookNotFoundResponse
    }
}


const getBooksOpts = {
    schema: {
        query: {
            author: { type: 'string' },
            published_year: { type: 'number', minimum: -9999, maximum: new Date().getFullYear() },
            sort: { type: 'string', enum: ['ASC', 'DESC'], default: 'DESC' },
            page: { type: 'number', minimum: 1, default: 1 }
        },
        additionalProperties: false
    },
    response: {
        200: {
            type: 'array',
            books: book
        }
    }
}

const postBookOpts = {
    schema: {
        body: {
            type: 'object',
            required: ['title', 'author', 'isbn', 'published_year'],
            properties: {
                title: { type: 'string' },
                author: { type: 'string' },
                isbn: { type: 'string', maximum: 13 },
                published_year: { type: 'number' }
            }
        }
    },
    response: {
        201: book
    }
}

const putBookOpts = {
    schema: {
        body: {
            type: 'object',
            required: ['title', 'author', 'isbn', 'published_year'],
            properties: {
                title: { type: 'string' },
                author: { type: 'string' },
                isbn: { type: 'string' },
                published_year: { type: 'number' }
            }
        }
    },
    response: {
        201: book,
        404: bookNotFoundResponse
    }
}


module.exports = { getBooksOpts, getBookOpts, postBookOpts, putBookOpts }