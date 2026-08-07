export interface RegisterBody {
    username: string;
    email: string;
    password: string;
}

export interface LoginBody {
    identifier: string;
    password: string;
}

export interface User {
    user_id: string,
    role: string
}