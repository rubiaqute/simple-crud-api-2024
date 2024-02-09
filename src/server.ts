import * as http from "http";
import { createUserController, getAllUsersController, getUserController, notifyServerError, notifyWrongUrl, updateUserController, deleteUserController } from './users/controllers'

export const server = http.createServer((req, res) => {
    const method = req.method
    const url = req.url
    try {
        switch (method) {
            case "GET": {
                if (url === "/api/users") {
                    getAllUsersController(res)
                    return 
                }
                if (url?.startsWith('/api/users')) {
                    getUserController(res, url.split('/api/users/')?.[1])
                    return
                }
            }

            case "POST": {
                if (url === "/api/users") {
                    getRequestBody(req, res, createUserController)
                    return
                }
            }

            case "PUT": {
                if (url?.startsWith('/api/users')) {
                    getRequestBody(req, res, updateUserController, url.split('/api/users/')?.[1])
                    return
                }
            }

            case "DELETE": {
                if (url?.startsWith('/api/users')) {
                    deleteUserController(res, url.split('/api/users/')?.[1])
                    return
                }
            }
        }

        notifyWrongUrl(res)
    } catch {
        notifyServerError(res)
    }
    
});

const getRequestBody = (req: http.IncomingMessage, res: http.ServerResponse, cb: (body: any, res: http.ServerResponse, uuid?: string) => void, uuid?: string) => {
    let body = ''

    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on("end", () => {
        try {
            cb(JSON.parse(body), res, uuid)
        } catch {
            notifyServerError(res)
        }
    })
}