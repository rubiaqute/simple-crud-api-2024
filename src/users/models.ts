import { CreateUserPayload, UpdateUserPayload, User } from "./types";
import { v4 as uuid } from "uuid";

export let users: User[] = [
    {
        id: "b350e5a8-b158-4a8c-8ffe-051da533b8b8",
        username: "Anna Schmecken",
        age: 67,
        hobbies: ['music', 'yoga']
    }
]

export const getAllUsers = () => users

export const setUsers = (newUsers: User[]) => users = newUsers

export const getUser = (id: string) => {
    const findedUser = users.find((user) => user.id === id)
    return findedUser ?? null
}

export const deleteUser = (id: string) => {
    const findedUser = getUser(id)
    users = users.filter((user) => user.id !== id)

    return Boolean(findedUser)
} 

export const createUser = (creteUserPayload: CreateUserPayload) => {
    const newUser = {
        ...creteUserPayload,
        id: uuid()
    }

    users.push(newUser)

    return newUser
}

export const updateUser = (id: string, updateUserPayload: UpdateUserPayload) => {
    let findedUser = getUser(id) 

    if (findedUser) {
        findedUser = {
            ...findedUser,
            ...updateUserPayload
        }

        deleteUser(id)
        users.push(findedUser)
    }

    return findedUser ?? null
}