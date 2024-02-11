import { IncomingMessage, ServerResponse } from "http";
import { CODES, ERRORS } from "./users/types";

export const sendCode = (res: ServerResponse, code: number) => {
    res.writeHead(code, { "Content-Type": "application/json" });
}

export const sendBody = (res: ServerResponse, body: unknown) => {
    res.write(JSON.stringify(body));
}

const notifyError = (res: ServerResponse, code: number, message: string) => {
    sendCode(res, code)
    res.end(JSON.stringify({ message }))
}

export const notifyInvalidUuid = (res: ServerResponse) => {
    notifyError(res, CODES.badRequest, ERRORS.invalidUuid)
}

export const notifyInvalidPayload = (res: ServerResponse) => {
    notifyError(res, CODES.badRequest, ERRORS.invalidPayload)
}

export const notifyNotFoundUser = (res: ServerResponse) => {
    notifyError(res, CODES.notFound, ERRORS.notFoundUser)
}

export const notifyServerError = (res: ServerResponse) => {
    notifyError(res, CODES.serverError, ERRORS.serverError)
}

export const notifyWrongUrl = (res: ServerResponse) => {
    notifyError(res, CODES.notFound, ERRORS.notFoundUrl)
}

export const getRequestBody = (req: IncomingMessage, res: ServerResponse, cb: (body: any, res: ServerResponse, uuid?: string) => void, uuid?: string) => {
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