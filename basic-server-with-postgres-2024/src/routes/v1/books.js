const { getBooksOpts } = require("../../schemas/v1/books")


const booksRoute = async (fastify) => {
    fastify.get('/books', getBooksOpts, async (request, reply) => {
        const client = await fastify.pg.connect()
        try {
            const {author, published_year, sort="DESC", page= 1 }= request.query
            const limit = 10
            const offset= (page - 1 ) * limit

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

    fastify.get('/books/:id', async (request, reply) => {
        const client = await fastify.pg.connect()
        try {
            const { id } = request.params
            const { rows } = await client.query("SELECT * FROM books where id=$1", [id])
            if (rows.length === 0) {
                reply.status(404).send({ error: "Book not found" })
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

    fastify.post('/books', async (request, reply) => {
        const client = await fastify.pg.connect();
        try {
            const { title, author, isbn, published_year } = request.body
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

    fastify.put('/books/:id', async (request, reply) => {
        const client = await fastify.pg.connect()
        try {
            const { id } = request.params
            const { title, author, isbn, published_year } = request.body
            const { rows } = await fastify.pg.query(
                "UPDATE books SET title=$1, author=$2, isbn=$3, published_year=$4 WHERE id=$5 RETURNING *",
                [title, author, isbn, published_year, id]
            )
            reply.code(201).send(rows[0])
        } catch (error) {
            console.error("Error updating the book", error)
            reply.status(500).send({ error: "Internal Server Error" })
        }
        finally{
            client.release()
        }
    })

    fastify.delete('/books/:id', async (request, reply) => {
        const client= await fastify.pg.connect()
        try {
            const {id} = request.params
            await client.query("DELETE FROM books WHERE id=$1", [id])
            reply.send(`Books with ${id} has been deleted`)
        } catch (error) {
            console.error("Error deleting the book", error)
            reply.status(500).send({ error: "Internal Server Error" })
        }
        finally{
            client.release()
        }
    })
}

module.exports = booksRoute 