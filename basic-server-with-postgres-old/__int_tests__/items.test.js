const setupTestEnv = require("./setupTestEnv");

const app = setupTestEnv();

describe("Integration test for CRUD endpoints connected to test db", () => {

    test('should create an item via POST route', async () => {
        const item = {
            name: "Test Item",
            description: "This is a test item",
            gross_amount: 20,   
        };

        const response = await app.inject({
            method: "POST",
            url: "/v2/",
            payload: item,
        });
        
        expect(response.statusCode).toBe(201);
        expect(response.json()).toMatchObject(item);
    });
    
    test('should retrieve created items via GET route', async () => {
        const item = {
            name: "Test Item",
            description: "This is a test item",
        };
        const response = await app.inject({
            method: "GET",
            url: "/v2/",
        });
    
        expect(response.statusCode).toBe(200);
        expect(response.json()).toMatchObject([item]);
    });
    
    test('should update an item', async () => {
        const {rows} = await app.pg.query("SELECT * FROM items LIMIT 1");
        expect(rows.length).toBe(1)
        const item = rows[0];
    
        const updatedItem = {
            name: "Updated Item",
            description: "This is an updated item",
            gross_amount: 20,   
        };
    
        const updatedResponse = await app.inject({
            method: "PUT",
            url: "/v2/" + item.id,
            payload: updatedItem,
        });
    
        expect(updatedResponse.statusCode).toBe(200);
        expect(updatedResponse.json()).toMatchObject(updatedItem);
    });
    
    test('should delete an item', async () => {
        const {rows} = await app.pg.query("SELECT * FROM items LIMIT 1");
        expect(rows.length).toBe(1)
        const item = rows[0];
    
        const deleteResponse = await app.inject({
            method: "DELETE",
            url: "/v2/" + item.id,
        });
    
        expect(deleteResponse.statusCode).toBe(200);
    });
});
