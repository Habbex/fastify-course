const book = {
    type: 'object',
    properties: {
        title: { type: 'string' },
        author: { type: 'string' },
        isbn: { type: 'string' },
        published_year: { type: 'number' }

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
                isbn: { type: 'string' },
                published_year: { type: 'number' }
            }
        }
    },
    response: {
        201: book
    }
}


module.exports = { getBooksOpts, postBookOpts }