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