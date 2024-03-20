const setupTestEnv = require('./setupTestEnv')

const app = setupTestEnv()

describe("Integration test for CRUD endpoints towards test db", () => {
    test("Should create an item via POST route and store it in test db", async () => {
        const item = {
            name: "Test Item",
            description: "This is a test item",
            gross_amount: 20
        }

        const response = await app.inject({
            method: "POST",
            url: "/v2/",
            payload: item
        })


        expect(response.statusCode).toBe(201)
        expect(response.json()).toMatchObject(item)
    })

    test("Should update an item via PUT route and store the updated values in test db", async () => {
        const { rows } = await app.pg.query("SELECT * FROM items LIMIT 1")
        expect(rows.length).toBe(1)

        const item = rows[0]

        const updatedItem = {
            name: "Updated Item",
            description: "This is an updated test item",
            gross_amount: "20",
        }

        const updatedItemResponse = await app.inject({
            method: "PUT",
            url: "/v2/" + item.id,
            payload: updatedItem
        })

        expect(updatedItemResponse.statusCode).toBe(200)
        expect(updatedItemResponse.json()).toMatchObject(updatedItem)
    })

    test('Should delete a test item', async () => {
        const { rows } = await app.pg.query("SELECT *FROM items LIMIT 1")
        expect(rows.length).toBe(1)

        const item = rows[0]

        const deleteItemResponse = await app.inject({
            method: "DELETE",
            url: "/v2/" + item.id
        })

        expect(deleteItemResponse.statusCode).toBe(200)
    })

    test('Should get all items from test db', async () => {
        const item = {
            name: "TEST item",
            description: "This is a fake test item"
        }

        const getAllItemsResponse = await app.inject({
            method: "GET",
            url: "/v2/"
        })

        expect(getAllItemsResponse.statusCode).toBe(200)
        expect(getAllItemsResponse.json()).toMatchObject([item])
    })
})