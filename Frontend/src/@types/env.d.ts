// src/@types/env.d.ts

declare namespace NodeJS {
    interface ProcessEnv {
        REACT_APP_USER: string;
        REACT_APP_API_KEY: string;
    }
}
