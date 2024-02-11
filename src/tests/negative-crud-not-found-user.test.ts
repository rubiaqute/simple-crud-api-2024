import supertest from 'supertest'
import { route, server } from '../server'
import { CODES, ERRORS } from '../users/types';

const notExistentUserId = 'b350e5a8-b158-4a8c-8ffe-051da533b8b9'

describe("Negative scenario for getting, changing and deleting not existent user", () => {
    it("we've got the correct code and error if we try to get the non-existent user", async () => {
        const res = await supertest(server)
            .get(`${route}/${notExistentUserId}`)

        expect(res.statusCode).toEqual(CODES.notFound);
        expect(res.error).toBeTruthy()
        expect(res.body.message).toBe(ERRORS.notFoundUser)
    });

    it("we've got the correct code and error if we try to delete the non-existent user", async () => {
        const res = await supertest(server)
            .delete(`${route}/${notExistentUserId}`)

        expect(res.statusCode).toEqual(CODES.notFound);
        expect(res.error).toBeTruthy()
        expect(res.body.message).toBe(ERRORS.notFoundUser)
    });

    it.each([
        {
            changedProp: {
                hobbies: []
            },
        },
        {
            changedProp: {
                age: 78
            },
        },
        {
            changedProp: {
                username: "Another Test User"
            },
        },
    ])("we've got the correct code and error if we try to change some prop of the non-existent user", async ({ changedProp }) => {
        const res = await supertest(server)
            .put(`${route}/${notExistentUserId}`)
            .send(changedProp)

        expect(res.statusCode).toEqual(CODES.notFound);
        expect(res.error).toBeTruthy()
        expect(res.body.message).toBe(ERRORS.notFoundUser)
    });
});