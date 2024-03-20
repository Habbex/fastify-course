const vatCalc = require('../../utlis/vatCalc')


const item = {
    type: 'object',
    properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        gross_amount: { type: 'number'},
    }
}

const postItemOpts = {
    schema: {
        body: {
            type: 'object',
            required: ['name', 'description', 'gross_amount'],
            properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                gross_amount: { type: 'number'},
            },
        },
response: {
    201: item,
        }
    }
}

const getItemsOpts = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: item
            }
        }
    }
}

const getItemOpts = {
    schema: {
        response: {
            200: item
        }
    }
}

const deleteItemOpts = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    message: {
                        type: 'string'
                    }
                }
            }
        }
    }
}

const updateItemOpts = {
    schema: {
        body: {
            type: 'object',
            required: ['name', 'description', 'gross_amount'],
            properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                gross_amount: { type: "number"},
            },
        },
response: {
    201: item,
        }
    }
}



const itemRoutes_v2 = async (fastify, options, done) => {

    fastify.post('/', postItemOpts, async (request, reply) => {
        const client = await fastify.pg.connect();
        try {
            const { name, description, gross_amount } = request.body
            const netAmount = vatCalc.calcNetAmount(gross_amount)
            const vatAmount = vatCalc.calcVAT(netAmount)
            const { rows } = await fastify.pg.query(
                'INSERT INTO items (name, description, gross_amount, net_amount, excluded_vat_amount) VALUES ($1, $2,$3,$4,$5) RETURNING *',
                [name, description, gross_amount, netAmount, vatAmount]
            )
            reply.code(201).send(rows[0])
        } catch (error) {
            reply.send(error)
        }
        finally {
            client.release()
        }
    })


    fastify.get('/', getItemsOpts, async (request, reply) => {
        const client = await fastify.pg.connect()
        try {
            const { rows } = await client.query("SELECT * FROM items")
            reply.send(rows)
        } catch (error) {
            reply.send(error)
        }
        finally {
            client.release()
        }
    })

    fastify.get('/:id', getItemOpts, async (request, reply) => {
        const client = await fastify.pg.connect();
        try {
            const { id } = request.params
            const { rows } = await client.query("SELECT * FROM items WHERE id=$1", [id])
            reply.send(rows[0])
        } catch (error) {
            reply.send(error)
        }
        finally {
            client.release();
        }
    })
    
    fastify.put('/:id', updateItemOpts, async (request, reply) => {
        const client = await fastify.pg.connect()
        try {
            const { id } = request.params
            const { name, description, gross_amount } = request.body
            const netAmount = vatCalc.calcNetAmount(gross_amount)
            const vatAmount = vatCalc.calcVAT(netAmount)
            const { rows } = await client.query(
                "UPDATE items SET name=$1 , description=$2, gross_amount=$3 , net_amount=$4,excluded_vat_amount=$5  WHERE id=$6 RETURNING *",
                [name, description, gross_amount, netAmount, vatAmount, id]
            )
            reply.send(rows[0])
        } catch (error) {
            reply.send(error)
        } finally {
            client.release()
        }
    })


    fastify.delete('/:id', deleteItemOpts, async (request, reply) => {
        const client = await fastify.pg.connect()
        try {
            const { id } = request.params
            await client.query("DELETE FROM items WHERE id=$1", [id])
            reply.send(`Item ${id} has been deleted`)
        } catch (error) {
            reply.send(error)
        }
        finally {
            client.release()
        }
    })
    done();
}

module.exports = { itemRoutes_v2 }