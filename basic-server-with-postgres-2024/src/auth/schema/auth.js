const signupSchema = {
  schema: {
    body: {
      type: 'object',
      required: ['username', 'password', 'role'],
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
        role: { type: 'string', enum: ['admin', 'normal'] },
      },
    },
  }
};

const signinSchema = {
  schema: {
    body: {
      type: 'object',
      required: ['username', 'password'],
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
    },
  }
};

module.exports = {
  signupSchema,
  signinSchema,
};
