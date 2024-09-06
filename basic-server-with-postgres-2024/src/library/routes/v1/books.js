
const { getBooksOpts, postBookOpts, getBookOpts, putBookOpts, deleteBookOpts } = require("../../schemas/v1/books")
const validateIsbn = require("../../validations/ibsn")

/**
 * Defines the routes for books in the application.
 *
 * @param {FastifyInstance} fastify - The Fastify instance.
 * @returns {Promise<void>}
 */
const booksRoute = async (fastify) => {
    fastify.addHook("preHandler", async (request, reply) => {
        try {
            await request.jwtVerify()
        } catch (error) {
            reply.code(401).send({ error: "Unauthorized" })
        }
    })

    const isAdmin = (request, reply, done)=>{
        const user= request.user
        if (user.role !== "admin") {
            return reply.code(403).send({error: "Forbidden"})
        }
        done()
    }

    fastify.get('/', getBooksOpts, async (request, reply) => {
        const client = await fastify.pg.connect()
        try {
            const { author, published_year, sort = "DESC", page = 1 } = request.query
            const limit = 10
            const offset = (page - 1) * limit

            let query = "SELECT * FROM books WHERE 1=1"

            const queryParams = []

            if (author) {
                queryParams.push(author)
                query += ` AND author = $${queryParams.length}`
            }

            if (published_year) {
                queryParams.push(published_year)
                query += ` AND published_year = $${queryParams.length}`
            }

            query += ` ORDER BY published_year ${sort}`
            query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`

            queryParams.push(limit, offset)

            const { rows } = await client.query(query, queryParams)
            reply.send(rows)
        } catch (error) {
            console.error("Error getting books", error)
            reply.status(500).send({ error: "Internal Server Error" })
        }
        finally {
            client.release()
        }
    })

    fastify.get('/:id', getBookOpts, async (request, reply) => {
        const client = await fastify.pg.connect()
        try {
            const { id } = request.params
            const { rows } = await client.query("SELECT * FROM books where id=$1", [id])
            if (rows.length === 0) {
                reply.status(404).send({
                    statusCode: 404,
                    error: "Not Found",
                    message: "The book you are looking for does not exist"
                })
            } else {
                reply.send(rows[0])
            }
        } catch (error) {
            console.error("Error getting the book", error)
            reply.status(500).send({ error: "Internal Server Error" })
        }
        finally {
            client.release()
        }
    })

    fastify.post('/', {preHandler: [isAdmin], schema:postBookOpts}, async (request, reply) => {
        const client = await fastify.pg.connect();
        try {
            const { title, author, isbn, published_year } = request.body

            if (!validateIsbn(isbn)) {
                reply.code(400).send({ error: "ISBN should either be 10 or 13 digits long" })
            }

            const { rows } = await fastify.pg.query("INSERT INTO books (title, author, isbn, published_year) VALUES ($1, $2, $3, $4) RETURNING *",
                [title, author, isbn, published_year]
            )

            reply.code(201).send(rows[0])
        } catch (error) {
            console.error("Error creating the book", error)
            reply.status(500).send({ error: "Internal Server Error" })
        }
        finally {
            client.release()
        }
    })

    fastify.put('/:id', {preHandler: [isAdmin], schema:putBookOpts}, async (request, reply) => {
        const client = await fastify.pg.connect()
        try {
            const { id } = request.params
            const { title, author, isbn, published_year } = request.body

            if (!validateIsbn(isbn)) {
                reply.code(400).send({ error: "ISBN should either be 10 or 13 digits long" })
            }

            const { rows } = await fastify.pg.query(
                "UPDATE books SET title=$1, author=$2, isbn=$3, published_year=$4 WHERE id=$5 RETURNING *",
                [title, author, isbn, published_year, id]
            )

            if (rows.length === 0) {
                reply.status(404).send({
                    statusCode: 404,
                    error: "Not Found",
                    message: "The book you are looking for does not exist"
                })
            } else {
                reply.code(200).send(rows[0])
            }

        } catch (error) {
            console.error("Error updating the book", error)
            reply.status(500).send({ error: "Internal Server Error" })
        }
        finally {
            client.release()
        }
    })

    fastify.delete('/:id',{preHandler: [isAdmin], schema: deleteBookOpts}, async (request, reply) => {
        const client = await fastify.pg.connect()
        try {
            const { id } = request.params
            const { rows } = await client.query("SELECT * FROM books where id=$1", [id])
            if (rows.length === 0) {
                reply.status(404).send({
                    statusCode: 404,
                    error: "Not Found",
                    message: "The book you are looking for does not exist"
                })
            } else {
                await client.query("DELETE FROM books WHERE id=$1", [id])
                reply.code(200).send(`Books with ${id} has been deleted`)
            }
        } catch (error) {
            console.error("Error deleting the book", error)
            reply.status(500).send({ error: "Internal Server Error" })
        }
        finally {
            client.release()
        }
    })
}

module.exports = booksRoute 