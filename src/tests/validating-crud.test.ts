import supertest from 'supertest'
import { route, server } from '../server'
import { CODES, ERRORS } from '../users/types';

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
        {
            user: {
                username: "Sarah",
                hobbies: [],
                age: "67676"
            },
        },
        {
            user: {
                username: "Sarah",
                hobbies: [],
                age: 9,
                unknownProp: 'not existed prop'
            },
        },
    ])("if we try to create the user without all required fields or not existed fields or fielda with wrong type, we will get the correct code and error", async ({ user }) => {
        const res = await supertest(server)
            .post(route)
            .send(user)

        expect(res.statusCode).toEqual(CODES.badRequest);
        expect(res.error).toBeTruthy()
        expect(res.body.message).toBe(ERRORS.invalidPayload)
    });

    it("we'll get the error if we try to get the user with incorrect id", async () => {
        const res = await supertest(server)
            .get(`${route}/${notCorrectId}`)

        expect(res.statusCode).toEqual(CODES.badRequest);
        expect(res.error).toBeTruthy()
        expect(res.body.message).toBe(ERRORS.invalidUuid)
    });

    it("we'll get the error if we try to delete the user with incorrect id", async () => {
        const res = await supertest(server)
            .delete(`${route}/${notCorrectId}`)

        expect(res.statusCode).toEqual(CODES.badRequest);
        expect(res.error).toBeTruthy()
        expect(res.body.message).toBe(ERRORS.invalidUuid)
    });
});