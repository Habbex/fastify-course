const vatCalculator = require("../../utlis/vatCalculator");

const Item = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    description: { type: "string" },
    gross_amount: { type: "number" }
  }
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
      required: ["name", "description", "gross_amount"],
      properties: {
        name: { type: "string" },
        description: { type: "string" },
        gross_amount: { type: "number" },
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
      required: ["name", "description", "gross_amount"],
      properties: {
        name: { type: "string" },
        description: { type: "string" },
        gross_amount: { type: "number" },
      },
    },
    response: {
      200: Item,
    },
  },
};

const itemRoutes_v2 = async (fastify, options, done) => {
  fastify.get("/", getItemsOpts, async (req, reply) => {
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
      const { name, description, gross_amount } = request.body;
      const netAmount=  vatCalculator.calculateNetAmount(gross_amount);
      const vatAmount = vatCalculator.calculateVAT(netAmount);
      const { rows } = await fastify.pg.query(
        "INSERT INTO items (name, description, gross_amount , net_amount , excluded_vat_amount) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [name, description, gross_amount, netAmount, vatAmount]
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
      const { name, description, gross_amount } = request.body;
      const netAmount=  vatCalculator.calculateNetAmount(gross_amount);
      const vatAmount = vatCalculator.calculateVAT(netAmount);
      const { rows } = await fastify.pg.query(
        "UPDATE items SET name=$1, description=$2, gross_amount=$3, net_amount=$4, excluded_vat_amount=$5 WHERE id=$6 RETURNING *",
        [name, description, gross_amount, netAmount, vatAmount, id]
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
