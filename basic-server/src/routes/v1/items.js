let items = require("../../Items");

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
        items:  Item ,
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
    body:{
      type: "object",
      required: ["name", "description"],
      properties: {
        name: { type: "string" },
        description: { type: "string" },
      }
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
    body:{
      type: "object",
      required: ["name", "description"],
      properties: {
        name: { type: "string" },
        description: { type: "string" },
      }
    },
    response: {
      200: Item,
    },
  },
};


const itemRoutes = (fastify, options, done) => {
  fastify.get("/", getItemsOpts, (request, reply) => {
    reply.send(items);
  });

  fastify.get("/:id", getItemOpts, (request, reply) => {
    const { id } = request.params;
    const item = items.find((item) => item.id === id);
    reply.send(item);
  });

  fastify.post("/", postItemOpts, (request, reply) => {
    const { name, description } = request.body;
    const item = { id: String(items.length + 1), name, description };
    items.push(item);
    reply.code(201).send(item);
  });

  fastify.delete("/:id", deleteItemOpts, (request, reply) => {
    const {id} = request.params;
    items= items.filter((item) => item.id !== id);
    reply.send(`Item ${id} deleted`);
  });

  fastify.put("/:id", updateItemOpts, (request, reply)=>{
    const {id}= request.params
    const {name, description}= request.body
    const item = items.find((item)=> item.id === id)
    item.name = name
    item.description = description
    reply.send(item)
  })

  done();
};

module.exports = { itemRoutes };
