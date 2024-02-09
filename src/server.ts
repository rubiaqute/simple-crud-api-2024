import * as http from "http";
import { createUserController, getAllUsersController, getUserController, notifyServerError, notifyWrongUrl } from './users/controllers'

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
        }

        notifyWrongUrl(res)
    } catch {
        notifyServerError(res)
    }
    
});

const getRequestBody = (req: http.IncomingMessage, res: http.ServerResponse, cb: (body: any, res: http.ServerResponse) => void) => {
    let body = ''

    req.on("data", (chunk) => {
        body += chunk.toString();
    });

    req.on("end", () => {
        cb(JSON.parse(JSON.stringify(body)), res)
    })
}