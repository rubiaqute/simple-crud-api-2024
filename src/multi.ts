import * as dotenv from "dotenv";
import cluster from 'cluster'
import * as os from 'os'
import http from 'http'

dotenv.config({ path: "./.env" });

import { server } from './server'
import { getAllUsers, setUsers } from "./users/models";

const PORT = +(process.env.PORT || '')

if (cluster.isPrimary) {
    let currentWorker = 1;
    const numCPUs = os.cpus().length;

    process.on('uncaughtException', () => {
        console.log('Something went wrong');
    });

    for (let i = 0; i < numCPUs; i++) {
        const childPort = PORT + i + 1
        const worker = cluster.fork({ port: childPort });
        worker.on('message', (data) => setUsers(data))
    }

    const mainServer = http.createServer((req, res) => {
        cluster.workers?.[currentWorker]?.send({ data: getAllUsers() });
        const forChildReq = http.request({ port: PORT + currentWorker, path: req.url, method: req.method });

        forChildReq.on('response', (childRes) => {
            res.statusCode = childRes.statusCode!;
            childRes.pipe(res);
            currentWorker = currentWorker >= numCPUs ? 1 : ++currentWorker;
        });
        req.pipe(forChildReq);
    });

    mainServer.listen(PORT, () => {
        console.log(`Master server started and listen port: ${PORT}`);
    });
} else {
    const childPort = PORT + (cluster.worker?.id ?? 0)
    server.listen(childPort, () => console.log(`Child port started at ${childPort}`));
}