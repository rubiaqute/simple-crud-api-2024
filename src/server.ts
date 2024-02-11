import cluster from "cluster";
import * as http from "http";
import { createUserController, getAllUsersController, getUserController, updateUserController, deleteUserController } from './users/controllers'
import { setUsers } from "./users/models";
import { METHODS } from "./users/types";
import { notifyServerError, notifyWrongUrl } from "./utils";

export const route = '/api/users'


if (cluster.isWorker) {
    process.on('message', ({ data }) => setUsers(data));
}

export const server = http.createServer((req, res) => {
    if (cluster.isWorker) {
        const childPort = +(process.env.PORT || '') + (cluster.worker?.id ?? 0)
        console.log(
            `[Work log] Child server Port:${childPort} URL: ${req.url} METHOD: ${req.method}`
        );
    }

    const method = req.method
    const url = req.url

    try {
        switch (method) {
            case METHODS.get: {
                if (url === route) {
                    getAllUsersController(res)
                    return
                }
                if (url?.startsWith(route)) {
                    getUserController(res, url.split(`${route}/`)?.[1])
                    return
                }
            }

            case METHODS.post: {
                if (url === route) {
                    createUserController(req, res)
                    return
                }
            }

            case METHODS.put: {
                if (url?.startsWith(route)) {
                    updateUserController(req, res, url.split(`${route}/`)?.[1])
                    return
                }
            }

            case METHODS.delete: {
                if (url?.startsWith(route)) {
                    deleteUserController(res, url.split(`${route}/`)?.[1])
                    return
                }
            }
        }

        notifyWrongUrl(res)
    } catch {
        notifyServerError(res)
    }
    
});

