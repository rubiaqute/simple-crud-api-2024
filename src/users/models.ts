import { CreateUserPayload, UpdateUserPayload, User } from "./types";
import { v4 as uuid } from "uuid";

let users: User[] = [
    {
        id: "123",
        username: "Anna Schmecken",
        age: 67,
        hobbies: ['music', 'yoga']
    }
]

export const getAllUsers = () => users

export const getUser = (id: string) => {
    const findedUser = users.find((user) => user.id === id)
    return findedUser ?? null
}

export const deleteUser = (id: string) => {
    const findedUser = getUser(id)
    users = users.filter((user) => user.id === id)

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
    }

    return findedUser ?? null
}