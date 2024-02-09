import { ServerResponse, IncomingMessage } from "http";
import { getAllUsers, getUser, createUser, updateUser, deleteUser } from './models'
import { validate as uuidValidate } from 'uuid';
import { CreateUserPayload, UpdateUserPayload } from "./types";

export const getAllUsersController = (res: ServerResponse) => {
    sendCode(res, 200)
    sendBody(res, getAllUsers())
    res.end();
}

export const getUserController = (res: ServerResponse, uuid: string) => {
    const isValidUuid = uuidValidate(uuid)

    if (isValidUuid) {
        const user = getUser(uuid)

        if (user) {
            sendCode(res, 200)
            sendBody(res, user)
            res.end()
        } else {
            notifyNotFoundUser(res)
        }

    } else {
        notifyInvalidUuid(res)
    }
}

export const createUserController = (body: CreateUserPayload, res: ServerResponse) => {
    const { hobbies, username, age } = body

    if (hobbies && username && age) {
        const newUser = createUser(body)
        sendCode(res, 201)
        sendBody(res, newUser)
        res.end()
    } else  {
        sendCode(res, 400)
        res.end(JSON.stringify({ message: "Some fields are missing" }))
    }

}

export const updateUserController = (body: UpdateUserPayload, res: ServerResponse, uuid?: string) => {
    const isValidUuid = uuidValidate(uuid || '')
    if (isValidUuid) {
        const updatedUser = updateUser(uuid || '', body)

        if (updatedUser) {
            sendCode(res, 200)
            sendBody(res, updatedUser)
            res.end() 
        } else {
            notifyNotFoundUser(res)
        }

    } else {
        notifyInvalidUuid(res)
    }

}

export const deleteUserController = (res: ServerResponse, uuid: string) => {
    const isValidUuid = uuidValidate(uuid)

    if (isValidUuid) {
        const isSuccess = deleteUser(uuid)

        if (isSuccess) {
            sendCode(res, 204)
            res.end()
        } else {
            notifyNotFoundUser(res)
        }

    } else {
        notifyInvalidUuid(res)
    }
}

const sendCode = (res: ServerResponse, code: number) => {
    res.writeHead(code, { "Content-Type": "application/json" });
}

const sendBody = (res: ServerResponse, body:unknown) => {
    res.write(JSON.stringify(body));
}

const notifyInvalidUuid = (res: ServerResponse) => {
    sendCode(res, 400)
    res.end(JSON.stringify({ message: "Provided id is not valid uuid" }))
}

const notifyNotFoundUser = (res: ServerResponse) => {
    sendCode(res, 404)
    res.end(JSON.stringify({ message: "User is not found" }))
}

export const notifyServerError = (res: ServerResponse) => {
    sendCode(res, 500)
    res.end(JSON.stringify({ message: "Server error" }))
}

export const notifyWrongUrl = (res: ServerResponse) => {
    sendCode(res, 404)
    res.end(JSON.stringify({ message: "Url not found" }))
}
