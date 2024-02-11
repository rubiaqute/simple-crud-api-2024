import * as dotenv from "dotenv";
import cluster from 'cluster'
import * as os from 'os'
import http from 'http'

dotenv.config({ path: "./.env" });

import { server } from './server'
import { getAllUsers, setUsers } from "./users/models";
import { ERRORS } from "./users/types";

const PORT = +(process.env.PORT || '')

if (cluster.isPrimary) {
    let currentWorkerId = 1;
    const cpusList = os.cpus()

    process.on('uncaughtException', () => {
        console.log(ERRORS.childServerError);
    });

    cpusList.forEach((cpu, index)=> {
        const childPort = PORT + index + 1
        const worker = cluster.fork({ port: childPort });
        worker.on('message', (data) => setUsers(data))
    })

    const mainServer = http.createServer((req, res) => {
        cluster.workers?.[currentWorkerId]?.send({ data: getAllUsers() });
        const childRequest = http.request({ port: PORT + currentWorkerId, path: req.url, method: req.method });

        childRequest.on('response', (childRes) => {
            res.statusCode = childRes.statusCode!;
            childRes.pipe(res);
            currentWorkerId = ((currentWorkerId + 1) % cpusList.length) + 1
        });
        req.pipe(childRequest);
    });

    mainServer.listen(PORT, () => {
        console.log(`Master server started and listen port: ${PORT}`);
    });
} else {
    const childPort = PORT + (cluster.worker?.id ?? 0)
    server.listen(childPort, () => console.log(`Child server started and listen port ${childPort}`));
}