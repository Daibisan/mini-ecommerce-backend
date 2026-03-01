export interface RegisterBody {
    username: string;
    email: string;
    password: string;
}

export interface LoginBody {
    identifier: string;
    password: string;
}