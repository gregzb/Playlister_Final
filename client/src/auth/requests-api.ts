const baseUrl = "http://localhost:4000/auth";

export type User = {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
};

type ErrT = {
    error: true;
    errorMsg: string;
};

type SuccessT = {
    error: false;
};

const exceptionWrapper = <T>(f: (...args: any[]) => Promise<ErrT | T>) => {
    return async (...args: any[]): Promise<ErrT | T> => {
        try {
            return await f(...args);
        } catch (err) {
            console.log(`Logged: Issue with function ${f.name}: ${err}`);
            return new Promise((res) => {
                res({
                    error: true,
                    errorMsg: `Issue with function ${f.name}: ${err}`
                });
            });
        }
    };
}

export const getLoggedIn = exceptionWrapper(async (): Promise<ErrT | SuccessT & {
    user: User;
    loggedIn: boolean;
}> => {
    const res = await fetch(`${baseUrl}/loggedIn/`, {
        method: "GET",
        credentials: "include",
    });
    return await res.json();
});

export const login = exceptionWrapper(async (email: string, password: string): Promise<ErrT | SuccessT & {
    user: User;
}> => {
    const loginObj = { email, password };
    const res = await fetch(`${baseUrl}/login/`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginObj),
    });
    return await res.json();
});

export const logout = exceptionWrapper(async (): Promise<ErrT | SuccessT & {

}> => {
    const res = await fetch(`${baseUrl}/logout/`, {
        method: "GET",
        credentials: "include",
    });
    return await res.json();
});

export const register = exceptionWrapper(async (username, firstName, lastName, email, password): Promise<ErrT | SuccessT & {
    user: User;
}> => {
    const registerObj = { username, firstName, lastName, email, password };
    const res = await fetch(`${baseUrl}/register/`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(registerObj),
    });
    return await res.json();
});