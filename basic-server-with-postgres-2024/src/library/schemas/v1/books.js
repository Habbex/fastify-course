const book = {
    type: 'object',
    properties: {
        id: {type: 'integer'},
        title: { type: 'string' },
        author: { type: 'string' },
        isbn: { type: 'string' },
        published_year: { type: 'number' }

    }
}

const bookNotFoundResponse = {
    type: 'object',
    properties: {
        statusCode: { type: 'integer' },
        error: { type: 'string' },
        message: { type: 'string' }
    },
    example: {
        statusCode: 404,
        error: "Not Found",
        message: "The book you r are looking for does not exist"
    }
}

const getBookOpts = {
    schema: {
        security: [{ bearerAuth: [] }], // Adding JWT security for this route
    },
    response: {
        200: book,
        404: bookNotFoundResponse
    }
}


const getBooksOpts = {
    schema: {
        security: [{ bearerAuth: [] }], // Adding JWT security for this route
        query: {
            author: { type: 'string' },
            published_year: { type: 'number' },
            sort: { type: 'string', enum: ['ASC', 'DESC'], default: 'DESC' },
            page: { type: 'number', minimum: 1, default: 1 }
        },
        additionalProperties: false
    },
    response: {
        200: {
            type: 'array',
            items: book
        }
    }
}

const postBookOpts = {
    security: [{ bearerAuth: [] }], // Adding JWT security for this route
    body: {
        type: 'object',
        required: ['title', 'author', 'isbn', 'published_year'],
        properties: {
            title: { type: 'string' },
            author: { type: 'string' },
            isbn: { type: 'string' },
            published_year: { type: 'number', minimum: -2100, maximum: new Date().getFullYear() },
        }
    },
    response: {
        201: book
    }
}

const putBookOpts = {
    security: [{ bearerAuth: [] }], // Adding JWT security for this route
    body: {
        type: 'object',
        required: ['title', 'author', 'isbn', 'published_year'],
        properties: {
            title: { type: 'string' },
            author: { type: 'string' },
            isbn: { type: 'string' },
            published_year: { type: 'number', minimum: -2100, maximum: new Date().getFullYear() },
        }
    },
    response: {
        201: book,
        404: bookNotFoundResponse
    },

}

const deleteBookOpts = {
    security: [{ bearerAuth: [] }], // Adding JWT security for this route
    response: {
        404: bookNotFoundResponse
    }
}


module.exports = { getBooksOpts, getBookOpts, postBookOpts, putBookOpts, deleteBookOpts }