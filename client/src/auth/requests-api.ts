const baseUrl = "http://localhost:4000/auth";

export type User = {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
};

type ErrT = {
    error: boolean;
    errorMsg?: string;
};

const exceptionWrapper = <T>(f: (...args: any[]) => T) => {
    return async (...args) => {
        try {
            return await f(...args);
        } catch (err) {
            console.log(`Issue with function ${f.name}: ${err}`);
        }
    };
}

export const getLoggedIn = exceptionWrapper(async (): Promise<ErrT & {
    user: User;
    loggedIn: boolean;
}> => {
    const res = await fetch(`${baseUrl}/loggedIn/`, {
        method: "GET",
        credentials: "include",
    });
    return await res.json();
});

export const login = exceptionWrapper(async (email: string, password: string): Promise<ErrT & {
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

export const logout = exceptionWrapper(async (): Promise<ErrT & {

}> => {
    const res = await fetch(`${baseUrl}/logout/`, {
        method: "GET",
        credentials: "include",
    });
    return await res.json();
});

export const register = exceptionWrapper(async (username, firstName, lastName, email, password): Promise<ErrT & {
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