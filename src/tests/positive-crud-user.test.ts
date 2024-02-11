import supertest from 'supertest'
import { route, server } from '../server'
import { CODES, User } from '../users/types';

const newUser = {
    username: "Test User",
    age: 12,
    hobbies: ["testing"],
}
let userId =''

describe("Positive scenario for creating, changing and deleting user", () => {
    it("we can create user and get correct code and response body", async () => {
        const res = await supertest(server)
            .post(route)
            .send(newUser);

        userId = res.body.id

        expect(res.statusCode).toEqual(CODES.created);
        expect(res.body).toMatchObject(newUser);
    });

    it("the created user should be in the list of users", async () => {
        const res = await supertest(server)
            .get(route)

        const users = res.body as User[]

        expect(res.statusCode).toEqual(CODES.ok);
        expect(users.find((user) => user.id === userId)).toBeTruthy()
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
    ])("we can successfully change users props and get correct code and response body", async ({ changedProp }) => {
        const res = await supertest(server)
            .put(`${route}/${userId}`)
            .send(changedProp)

        const user = res.body as User

        expect(res.statusCode).toEqual(CODES.ok);
        expect(user).toMatchObject(changedProp)
    });

    it("we can delete user and get the correct code", async () => {
        const res = await supertest(server)
            .delete(`${route}/${userId}`)

        expect(res.statusCode).toEqual(CODES.noContent);
    });

    it("the deleted user should not be in the list of users", async () => {
        const res = await supertest(server)
            .get(route)

        const users = res.body as User[]

        expect(users.find((user) => user.id === userId)).toBeFalsy()
    });
});