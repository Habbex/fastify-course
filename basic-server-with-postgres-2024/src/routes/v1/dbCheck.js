const dbCheck = async (fastify, options) => {
    fastify.get('/', async (request, reply) => {
        const client = await fastify.pg.connect()
        try {
            const { rows } = await fastify.pg.query('SELECT now()')
            reply.send(rows[0])
        } catch (error) {
            console.error("Error communicating with database:", error)
        }
        finally {
            client.release()
        }
    })
}
module.exports = { dbCheck }