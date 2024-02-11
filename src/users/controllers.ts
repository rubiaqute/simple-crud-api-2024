import { ServerResponse, IncomingMessage } from "http";
import { getAllUsers, getUser, createUser, updateUser, deleteUser } from './models'
import { validate as uuidValidate } from 'uuid';
import { CODES, CreateUserPayload,  UpdateUserPayload } from "./types";
import cluster from "cluster";
import { getRequestBody,  notifyInvalidPayload, notifyInvalidUuid, notifyNotFoundUser, sendBody, sendCode } from "../utils";

export const getAllUsersController = (res: ServerResponse) => {
    sendCode(res, CODES.ok)
    sendBody(res, getAllUsers())
    res.end();
}

export const getUserController = (res: ServerResponse, uuid: string) => {
    const isValidUuid = uuidValidate(uuid)

    if (isValidUuid) {
        const user = getUser(uuid)

        if (user) {
            sendCode(res, CODES.ok)
            sendBody(res, user)
            res.end()
        } else {
            notifyNotFoundUser(res)
        }

    } else {
        notifyInvalidUuid(res)
    }
}

export const createUserController = (req: IncomingMessage, res: ServerResponse) => {
    getRequestBody(req, res, createUserCallBack)
}

export const updateUserController = (req: IncomingMessage, res: ServerResponse, uuid: string) => {
    getRequestBody(req, res, updateUserCallBack, uuid)
}

const createUserCallBack = (body: CreateUserPayload, res: ServerResponse) => {
    const { hobbies, username, age } = body

    if (hobbies && username && age && isValidPayload(body)) {
        const newUser = createUser(body)
        sendCode(res, CODES.created)
        sendBody(res, newUser)
        res.end()
    } else {
        notifyInvalidPayload(res)
    }

    if (cluster.isWorker) {
        process.send?.(getAllUsers());
    }

}

const updateUserCallBack = (body: UpdateUserPayload, res: ServerResponse, uuid?: string) => {
    const isValidUuid = uuidValidate(uuid || '')
    if (isValidUuid) {

        if (isValidPayload(body)) {
            const updatedUser = updateUser(uuid || '', body)

            if (updatedUser) {
                sendCode(res, CODES.ok)
                sendBody(res, updatedUser)
                res.end()
            } else {
                notifyNotFoundUser(res)
            }
        } else {
            notifyInvalidPayload(res)
        }

    } else {
        notifyInvalidUuid(res)
    }

    if (cluster.isWorker) {
        process.send?.(getAllUsers());
    }

}

export const deleteUserController = (res: ServerResponse, uuid: string) => {
    const isValidUuid = uuidValidate(uuid)

    if (isValidUuid) {
        const isSuccess = deleteUser(uuid)

        if (isSuccess) {
            sendCode(res, CODES.noContent)
            res.end()
        } else {
            notifyNotFoundUser(res)
        }

    } else {
        notifyInvalidUuid(res)
    }

    if (cluster.isWorker) {
        process.send?.(getAllUsers());
    }
}

export const isValidPayload = (payload: UpdateUserPayload)=> {
    const props = ['hobbies', 'username', 'age']
    const isOnlyKnownProps = Object.keys(payload).every((prop) => props.includes(prop))

    const {username, hobbies, age} = payload
    const isCorrectTypeHobbies = !hobbies || (Array.isArray(hobbies) && hobbies.every((hobby)=> typeof hobby === 'string'))
    const isCorrectTypeAge = (age === undefined) || (typeof age === 'number')
    const isCorrectTypeUserName = !username || (typeof username === 'string')

    return isOnlyKnownProps && isCorrectTypeHobbies && isCorrectTypeAge && isCorrectTypeUserName
}


