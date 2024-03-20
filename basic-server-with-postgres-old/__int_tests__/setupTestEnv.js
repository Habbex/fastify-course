const { build } = require("../src/app");
const env = require("../src/config/env");

const clearDatabaseSQL = "DELETE FROM items";
const createTableSQL =
  "CREATE TABLE IF NOT EXISTS Items (id SERIAL, name VARCHAR(200),description VARCHAR(500), gross_amount NUMERIC , net_amount NUMERIC , excluded_vat_amount NUMERIC, PRIMARY KEY(id));";
const insertFakeItemSQL =
  "INSERT INTO items (name, description, gross_amount , net_amount , excluded_vat_amount) VALUES ($1, $2, $3, $4, $5)";

module.exports = function setupTestEnv() {
  const app = build(
    {
      logger: true,
    },
    {},
    {
      connectionString: env.POSTGRES_TEMP_DB_CONNECTION_STRING,
    }
  );

  beforeAll(async () => {
    await app.ready();
    await app.pg.query(createTableSQL);
    await app.pg.query(clearDatabaseSQL);
  });

  beforeEach(async () => {
    await app.pg.query(insertFakeItemSQL, ["Test Item", "This is a test item", 20, 16.67, 3.33]);
  });

  afterEach(async () => {
    await app.pg.query(clearDatabaseSQL);
  });

  afterAll(async () => {
    await app.pg.query("DROP TABLE IF EXISTS items");
    app.close();
  });

  return app;
};
