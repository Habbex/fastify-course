const Item = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    description: { type: "string" },
  },
};

const getItemsOpts = {
  schema: {
    response: {
      200: {
        type: "array",
        items: Item,
      },
    },
  },
};

const getItemOpts = {
  schema: {
    response: {
      200: Item,
    },
  },
};

const postItemOpts = {
  schema: {
    body: {
      type: "object",
      required: ["name", "description"],
      properties: {
        name: { type: "string" },
        description: { type: "string" },
      },
    },
    response: {
      201: Item,
    },
  },
};

const deleteItemOpts = {
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
  },
};

const updateItemOpts = {
  schema: {
    body: {
      type: "object",
      required: ["name", "description"],
      properties: {
        name: { type: "string" },
        description: { type: "string" },
      },
    },
    response: {
      200: Item,
    },
  },
};

const itemRoutes_v2 = async (fastify, options, done) => {
  fastify.get("/", async (req, reply) => {
    const client = await fastify.pg.connect();
    try {
      const { rows } = await client.query("SELECT * FROM items");
      // Note: avoid doing expensive computation here, this will block releasing the client
      reply.send(rows);
    } catch (err) {
      reply.send(err);
    } finally {
      // Release the client immediately after query resolves, or upon error
      client.release();
    }
  });

  fastify.get("/:id", getItemOpts, async (request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const { id } = request.params;
      const { rows } = await fastify.pg.query(
        "SELECT * FROM items WHERE id=$1",
        [id]
      );
      reply.send(rows[0]);
    } catch (err) {
      reply.send(err);
    } finally {
      client.release();
    }
  });

  fastify.post("/", postItemOpts, async (request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const { name, description } = request.body;
      const { rows } = await fastify.pg.query(
        "INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *",
        [name, description]
      );
      reply.code(201).send(rows[0]);
    } catch (err) {
      reply.send(err);
    } finally {
      client.release();
    }
  });

  fastify.delete("/:id", deleteItemOpts, async (request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const { id } = request.params;
      await fastify.pg.query("DELETE FROM items WHERE id=$1", [id]);
      reply.send(`Item ${id} deleted`);
    } catch (err) {
      reply.send(err);
    } finally {
      client.release();
    }
  });

  fastify.put("/:id", updateItemOpts, async (request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const { id } = request.params;
      const { name, description } = request.body;
      const { rows } = await fastify.pg.query(
        "UPDATE items SET name=$1, description=$2 WHERE id=$3 RETURNING *",
        [name, description, id]
      );
      reply.send(rows[0]);
    } catch (err) {
      reply.send(err);
    } finally {
      client.release();
    }
  });

  done();
};

module.exports = { itemRoutes_v2 };
