import supertest from 'supertest'
import { server } from '../server'
import { User } from '../users/types';

const newUser = {
    username: "Test User",
    age: 12,
    hobbies: ["testing"],
}
let userId =''

describe("Positive scenario for creating, changing and deleting user", () => {
    it("we can create user and get correct code and response body", async () => {
        const res = await supertest(server)
            .post("/api/users")
            .send(newUser);

        userId = res.body.id

        expect(res.statusCode).toEqual(201);
        expect(res.body).toMatchObject(newUser);
    });

    it("the created user should be in the list of users", async () => {
        const res = await supertest(server)
            .get(`/api/users`)

        const users = res.body as User[]

        expect(res.statusCode).toEqual(200);
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
            userName: "Another Test User"
        },
    },
    ])("we can successfully change users props and get correct code and response body", async ({ changedProp }) => {
        const res = await supertest(server)
            .put(`/api/users/${userId}`)
            .send(changedProp)

        const user = res.body as User

        expect(res.statusCode).toEqual(200);
        expect(user).toMatchObject(changedProp)
    });

    it("we can delete user and get the correct code", async () => {
        const res = await supertest(server)
            .delete(`/api/users/${userId}`)

        expect(res.statusCode).toEqual(204);
    });

    it("the deleted user should not be in the list of users", async () => {
        const res = await supertest(server)
            .get(`/api/users`)

        const users = res.body as User[]

        expect(users.find((user) => user.id === userId)).toBeFalsy()
    });
});