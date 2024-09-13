const setupTestApp = require("./setupTestApp");
const env = require("../src/config/env")
const testToken= "Bearer " + env.TEST_TOKEN;

const testApp= setupTestApp()

describe("Intgretation test for books CRUD API", () => {
    test("should create a new book via POST route", async()=>{
        const testBook= {
                "title": "Test book 2",
                "author": "Test author 2",
                "isbn": "1234567892",
                "published_year": 2024
            }

        const response = await testApp.inject({
            method: "POST",
            url: "/v1/books/",
            headers: {"authorization": testToken},
            payload: testBook,
            
        })
        expect(response.statusCode).toBe(201);
        expect(response.json()).toMatchObject(testBook);
    })

    test("should update a book via PUT route", async () => {
        const testBook = {
            "title": "Test book 1",
            "author": "Test author 1",
            "isbn": "1234567892",
            "published_year": 2024
        }

        const postResponse = await testApp.inject({
            method: "POST",
            url: "/v1/books/",
            headers: {"authorization": testToken},
            payload: testBook
        })
        expect(postResponse.statusCode).toBe(201);
        expect(postResponse.json()).toMatchObject(testBook);

        const updatedBook = {
            "title": "Test book 2",
            "author": "Test author 2",
            "isbn": "1234567892",
            "published_year": 2024
        }

        const response = await testApp.inject({
            method: "PUT",
            url: "/v1/books/" + postResponse.json().id,
            headers: {"authorization": testToken},
            payload: updatedBook

        })

        expect(response.statusCode).toBe(200);
        expect(response.json()).toMatchObject(updatedBook);
    })

    test("should fail when id is a string", async()=>{
       
        const getResponse= await testApp.inject({
            method: "GET",
            url: "/v1/books/" + "bob",
            headers: {"authorization": testToken},
        })

        expect(getResponse.statusCode).toBe(400);
    })

    test("should return 404 when not found", async()=>{
       
        const getResponse= await testApp.inject({
            method: "GET",
            url: "/v1/books/" + 50,
            headers: {"authorization": testToken},
        })

        expect(getResponse.statusCode).toBe(404);
    })
    
    test("should get newly created book via GET route", async()=>{
        const testBook= {
                "title": "Test book 2",
                "author": "Test author 2",
                "isbn": "1234567892",
                "published_year": 2024
            }

        const postResponse = await testApp.inject({
            method: "POST",
            url: "/v1/books/",
            headers: {"authorization": testToken},
            payload: testBook
        })
        expect(postResponse.statusCode).toBe(201);
        expect(postResponse.json()).toMatchObject(testBook);

        const getResponse= await testApp.inject({
            method: "GET",
            url: "/v1/books/" + postResponse.json().id,
            headers: {"authorization": testToken},
        })

        expect(getResponse.statusCode).toBe(200);
        expect(getResponse.json()).toMatchObject(testBook);
    })

    test("should get created books via GET route", async()=>{
        const testBook= {
                "title": "Test book 2",
                "author": "Test author 2",
                "isbn": "1234567892",
                "published_year": 2024
            }

        const postResponse = await testApp.inject({
            method: "POST",
            url: "/v1/books/",
            headers: {"authorization": testToken},
            payload: testBook
        })
        expect(postResponse.statusCode).toBe(201);
        expect(postResponse.json()).toMatchObject(testBook);

        const getResponse= await testApp.inject({
            method: "GET",
            url: "/v1/books/",
            headers: {"authorization": testToken},
        })
        expect(getResponse.statusCode).toBe(200);
        expect(getResponse.json().length).toBe(2)
    })
})

