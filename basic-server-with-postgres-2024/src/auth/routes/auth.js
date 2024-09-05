const { signupSchema, signinSchema } = require("../schema/auth")

const authRoutes = async (fastify) => {
    fastify.post('/signup', signupSchema, async (request, reply) => {
        const { username, password, role } = request.body
        const hashedPassword = await fastify.bcrypt.hash(password)
        const client = await fastify.pg.connect();
        try {
            await client.query(
                'INSERT INTO users (username, password, role) VALUES ($1, $2, $3)',
                [username, hashedPassword, role])
            reply.send({ message: 'User created successfully' });
        } catch (error) {
            console.error("Error creating user", error)
            reply.code(400).send({ error: err.message });
        } finally {
            client.release()
        }
    })

    fastify.post('/signin', signinSchema, async (request, reply) => {
        const { username, password } = request.body
        const client = await fastify.pg.connect();
        try {
            const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
            const user = result.rows[0];
            if (!user) {
                return reply.code(401).send({ error: "User not found" })
            }

            const vaildPassword = await fastify.bcrypt.compare(password, user.password)
            
            if (!vaildPassword) {
                return reply.code(401).send({ error: "Invaild credentials" })
            }

            const token = fastify.jwt.sign({
                username: user.username,
                role: user.role
            })

            reply.send({ token })
        } catch (error) {
            console.error("Error sigin user", error)
            reply.code(500).send({ error: err.message });
        } finally {
            client.release()
        }
    })
}

module.exports= authRoutes