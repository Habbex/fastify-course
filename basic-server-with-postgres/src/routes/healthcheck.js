const healthcheck = (fastify, options, done) => {
    fastify.get('/', (req, reply) => {
        reply.send("I'm okay")   
    })
    done()
}

module.exports = {healthcheck}