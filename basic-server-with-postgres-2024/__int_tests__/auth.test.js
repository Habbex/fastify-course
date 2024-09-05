const setupTestAuthApp = require("./setupTestAuthApp");
const testAppAuth = setupTestAuthApp()

describe("POST /signup", () => {
    it("should allow a user to sign up successfully", async () => {
        const normalUser = {
            username: 'testuser',
            password: 'testpassword',
            role: 'normal',
        }

        const response = await testAppAuth.inject({
            method: "POST",
            url: "/auth/signup",
            payload: normalUser,
        })

        expect(response.statusCode).toBe(200);
        expect(response.json()).toHaveProperty('message', 'User created successfully');
    })
    it('should return 400 if required fields are missing', async () => {
        const incorrectUser = {
            username: 'testuser',
        }

        const response = await testAppAuth.inject({
            method: "POST",
            url: "/auth/signup",
            payload: incorrectUser,
        })

        expect(response.statusCode).toBe(400);
    })
})

describe("POST /signin", () => {
    it("should allow user to sign in and return JWT token", async () => {
        const normalUser = {
            username: 'testuser',
            password: 'testpassword',
            role: 'normal',
        }

        const signUpResponse = await testAppAuth.inject({
            method: "POST",
            url: "/auth/signup",
            payload: normalUser,
        })

        expect(signUpResponse.statusCode).toBe(200);
        expect(signUpResponse.json()).toHaveProperty('message', 'User created successfully');

        const signInRepsonse = await testAppAuth.inject({
            method: "POST",
            url: "/auth/signin",
            payload: {
                username: normalUser.username,
                password: normalUser.password
            },
        })
        expect(signInRepsonse.statusCode).toBe(200);
        expect(signInRepsonse.json()).toHaveProperty('token');
    })
    it('should return 401 if credentials are invalid', async () => {
        const response = await testAppAuth.inject({
            method: "POST",
            url: "/auth/signin",
            payload: {
                username: 'nonexistentuser',
                password: 'wrongpassword',
            }
        });

        expect(response.statusCode).toBe(401);
    });
})