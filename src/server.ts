import * as http from "http";

export const server = http.createServer((req, res) => {
    if (req.url === "/api/users" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify({user1: "Lala"}));
        res.end();
    }
    // } else if (
    //     req.url.match(/\/api\/users\/([0-9a-z-]+)/) &&
    //     req.method === "GET"
    // ) {
    //     const id = req.url.split("/")[3];
    //     getUser(req, res, id);
    // } else if (req.url === "/api/users" && req.method === "POST") {
    //     createUser(req, res);
    // } else if (
    //     req.url.match(/\/api\/users\/([0-9a-z-]+)/) &&
    //     req.method === "PUT"
    // ) {
    //     const id = req.url.split("/")[3];
    //     updateUser(req, res, id);
    // } else if (
    //     req.url.match(/\/api\/users\/([0-9a-z-]+)/) &&
    //     req.method === "DELETE"
    // ) {
    //     const id = req.url.split("/")[3];
    //     deleteUser(req, res, id);
    // } else {
    //     res.writeHead(404, { "Content-Type": "application/json" });
    //     res.end(JSON.stringify({ message: "Route not found" }));
    // }
});