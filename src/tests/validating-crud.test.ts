import supertest from 'supertest'
import { server } from '../server'

const notCorrectId = '123'

describe("All the methods have correct validation", () => {
    it.each([
        {
            user: {
                hobbies: [],
                age: 87,
            },
        },
        {
            user: {
                username: "Sarah",
                age: 87,
            },
        },
        {
            user: {
                username: "Sarah",
                hobbies: [],
            },
        },
    ])("if we try to create the user without all required fields, we will get the correct code and error", async ({ user }) => {
        const res = await supertest(server)
            .post(`/api/users`)
            .send(user)

        expect(res.statusCode).toEqual(400);
        expect(res.error).toBeTruthy()
        expect(res.body.message).toBe('Some fields are missing')
    });

    it("we'll get the error if we try to get the user with incorrect id", async () => {
        const res = await supertest(server)
            .get(`/api/users/${notCorrectId}`)

        expect(res.statusCode).toEqual(400);
        expect(res.error).toBeTruthy()
        expect(res.body.message).toBe('Provided id is not valid uuid')
    });

    it("we'll get the error if we try to delete the user with incorrect id", async () => {
        const res = await supertest(server)
            .delete(`/api/users/${notCorrectId}`)

        expect(res.statusCode).toEqual(400);
        expect(res.error).toBeTruthy()
        expect(res.body.message).toBe('Provided id is not valid uuid')
    });
});