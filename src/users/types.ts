export interface User {
    id: string
    username: string
    age: number
    hobbies: string[]
}

export interface CreateUserPayload {
    username: string
    age: number
    hobbies: string[]
}

export interface UpdateUserPayload {
    username?: string
    age?: number
    hobbies?: string[]
}

export enum ERRORS {
    invalidPayload = 'Incorrect payload fields or some fields are missing',
    invalidUuid ='Provided id is not valid uuid',
    notFoundUser ='User is not found',
    serverError ='Server error',
    notFoundUrl ='Url not found',
    childServerError ='Something went wrong in child server'
}

export enum CODES {
    ok = 200,
    created = 201,
    noContent = 204,
    badRequest = 400,
    serverError = 500,
    notFound = 404
}

export enum METHODS {
    delete = "DELETE",
    get="GET",
    post="POST",
    put="PUT"
}